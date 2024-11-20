import { Task } from "@/types/task";
import { Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TaskQuestionsDialog from "./questions/TaskQuestionsDialog";
import TaskClassificationButtons from "./TaskClassificationButtons";
import { useNotifications } from "@/contexts/NotificationContext";
import { useQueryClient } from "@tanstack/react-query";
import TaskActions from "./actions/TaskActions";
import SubtasksList from "./subtasks/SubtasksList";

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

      if (error) throw error;

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
      const subtasksToAdd = Object.values(responses).map(response => ({
        id: crypto.randomUUID(),
        content: response,
        completed: false
      }));

      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          subtasks: subtasksToAdd
        })
        .eq('id', task.id);

      if (updateError) throw updateError;

      await queryClient.invalidateQueries({ queryKey: ['tasks'] });

      setShowQuestions(false);
      toast({
        title: "Success",
        description: "Task has been broken down into subtasks",
      });
      
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

  const handleSubtaskCompletion = async (subtaskId: string, completed: boolean) => {
    try {
      // Ensure subtasks is an array before proceeding
      const currentSubtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
      
      const updatedSubtasks = currentSubtasks.map(subtask => 
        subtask.id === subtaskId ? { ...subtask, completed } : subtask
      );

      const { error } = await supabase
        .from('tasks')
        .update({
          subtasks: updatedSubtasks
        })
        .eq('id', task.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['tasks'] });

      toast({
        title: completed ? "Subtask completed" : "Subtask uncompleted",
        description: "Progress updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update subtask status",
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
        
        {showReclassify ? (
          <TaskClassificationButtons
            taskId={task.id}
            onClassify={(taskId, category) => {
              onMove?.(taskId, category);
              setShowReclassify(false);
            }}
          />
        ) : (
          <TaskActions
            isLoading={isLoading}
            onAIBreakdown={handleAIBreakdown}
            onReclassify={() => setShowReclassify(true)}
            onDelete={() => onDelete(task.id)}
          />
        )}
      </div>

      <SubtasksList
        subtasks={Array.isArray(task.subtasks) ? task.subtasks : null}
        onComplete={handleSubtaskCompletion}
      />

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