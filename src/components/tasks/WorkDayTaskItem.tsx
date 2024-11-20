import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { Clock, Trash2, Brain, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TaskQuestionsDialog from "./TaskQuestionsDialog";
import TaskClassificationButtons from "./TaskClassificationButtons";
import { useNotifications } from "@/contexts/NotificationContext";
import { useQueryClient } from "@tanstack/react-query";

interface WorkDayTaskItemProps {
  task: Task;
  onAddSubtask: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onMove?: (taskId: string, category: string) => void;
}

const WorkDayTaskItem = ({ task, onAddSubtask, onDelete, onMove }: WorkDayTaskItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showReclassify, setShowReclassify] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  const handleAIBreakdown = async () => {
    setIsLoading(true);
    try {
      const { data: { data: questions }, error } = await supabase.functions.invoke('break-down-task', {
        body: { content: task.content }
      });

      if (error) {
        throw error;
      }

      if (!questions || !Array.isArray(questions)) {
        throw new Error('Invalid response format from AI service');
      }

      setQuestions(questions);
      setShowQuestions(true);
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during AI breakdown';
      addNotification({
        title: 'AI Breakdown Error',
        message: errorMessage,
        type: 'error'
      });
      toast({
        title: "Error",
        description: "Failed to break down task. Check notifications for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionResponse = async (responses: Record<string, string>) => {
    try {
      // Update the task with subtasks based on responses
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          subtasks: Object.values(responses).map((response, index) => ({
            id: crypto.randomUUID(),
            content: response,
            completed: false
          }))
        })
        .eq('id', task.id);

      if (updateError) throw updateError;

      // Invalidate the tasks query to trigger a refresh
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });

      setShowQuestions(false);
      toast({
        title: "Success",
        description: "Task has been broken down into subtasks",
      });
      
      // Trigger a refresh of the task list
      onAddSubtask(task.id);
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while processing responses';
      addNotification({
        title: 'Task Breakdown Error',
        message: errorMessage,
        type: 'error'
      });
      toast({
        title: "Error",
        description: "Failed to process responses. Check notifications for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800 mb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-100">{task.content}</span>
          {task.subtasks && task.subtasks.length > 0 && (
            <span className="text-xs text-gray-400">
              ({task.subtasks.length} subtasks)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {showReclassify ? (
            <TaskClassificationButtons
              taskId={task.id}
              onClassify={(taskId, category) => {
                onMove?.(taskId, category);
                setShowReclassify(false);
              }}
            />
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleAIBreakdown}
                disabled={isLoading}
                title="AI Breakdown"
              >
                {isLoading ? (
                  <div className="animate-spin">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                ) : (
                  <Brain className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowReclassify(true)}
                title="Reclassify"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="ml-6 space-y-2 mt-2 mb-4">
          {task.subtasks.map((subtask, index) => (
            <div key={subtask.id} className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-gray-500">{index + 1}.</span>
              {subtask.content}
            </div>
          ))}
        </div>
      )}

      <TaskQuestionsDialog
        open={showQuestions}
        onOpenChange={setShowQuestions}
        questions={questions}
        onSubmit={handleQuestionResponse}
      />
    </>
  );
};

export default WorkDayTaskItem;