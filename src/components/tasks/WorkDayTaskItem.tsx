import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { Clock, Plus, Trash2, Brain, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TaskQuestionsDialog from "./TaskQuestionsDialog";

interface WorkDayTaskItemProps {
  task: Task;
  onAddSubtask: (taskId: string) => void;
  onGenerateAISubtasks: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const WorkDayTaskItem = ({ task, onAddSubtask, onGenerateAISubtasks, onDelete }: WorkDayTaskItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const { toast } = useToast();

  const handleAIBreakdown = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('break-down-task', {
        body: { taskContent: task.content }
      });

      if (error) throw error;

      if (data.questions && data.questions.length > 0) {
        const formattedQuestions = data.questions.map((q: string) => ({
          text: q,
          type: q.toLowerCase().includes('prefer') ? 'radio' : 'text',
          options: q.toLowerCase().includes('prefer') ? ['Manual', 'Automated'] : undefined
        }));
        setQuestions(formattedQuestions);
        setShowQuestions(true);
      } else if (data.steps && data.steps.length > 0) {
        const subtasks = data.steps.map((step: string) => ({
          id: crypto.randomUUID(),
          content: step,
          completed: false
        }));
        
        try {
          const { error: updateError } = await supabase
            .from('tasks')
            .update({ 
              subtasks: subtasks
            })
            .eq('id', task.id);

          if (updateError) throw updateError;

          onGenerateAISubtasks(task.id);
          toast({
            title: "AI Subtasks Generated",
            description: "Added suggested subtasks to your task"
          });
        } catch (error: any) {
          toast({
            title: "Failed to save subtasks",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error breaking down task",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSubmit = async (answers: Record<string, string>) => {
    try {
      const { data, error } = await supabase.functions.invoke('break-down-task', {
        body: { 
          taskContent: task.content,
          answers: Object.values(answers)
        }
      });

      if (error) throw error;

      if (data.steps && data.steps.length > 0) {
        const subtasks = data.steps.map((step: string) => ({
          id: crypto.randomUUID(),
          content: step,
          completed: false
        }));
        
        try {
          const { error: updateError } = await supabase
            .from('tasks')
            .update({ 
              subtasks: subtasks
            })
            .eq('id', task.id);

          if (updateError) throw updateError;

          onGenerateAISubtasks(task.id);
          toast({
            title: "AI Subtasks Generated",
            description: "Added suggested subtasks based on your answers"
          });
        } catch (error: any) {
          toast({
            title: "Failed to save subtasks",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error processing answers",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-3 rounded-md bg-[#1a2747] hover:bg-[#1f2f52] border border-gray-700">
        <div className="flex items-center gap-3">
          <button className="opacity-60 hover:opacity-100">
            <Clock className="h-4 w-4 text-gray-300" />
          </button>
          <span className="text-sm text-gray-100">{task.content}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onAddSubtask(task.id)}
            title="Add Subtask"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleAIBreakdown}
            disabled={isLoading}
            title="AI Breakdown"
          >
            <Brain className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="ml-6 space-y-2">
          {task.subtasks.map(subtask => (
            <div
              key={subtask.id}
              className="flex items-center justify-between p-2 rounded-md bg-[#1a2747]/50 border border-gray-700"
            >
              <span className="text-sm text-gray-300">{subtask.content}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {/* Handle subtask completion */}}
              >
                <Check className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <TaskQuestionsDialog
        questions={questions}
        open={showQuestions}
        onOpenChange={setShowQuestions}
        onSubmit={handleQuestionSubmit}
      />
    </div>
  );
};

export default WorkDayTaskItem;