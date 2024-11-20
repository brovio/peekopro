import { useToast } from "@/components/ui/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { supabase } from "@/integrations/supabase/client";
import { SubTask } from "@/types/task";
import { useQueryClient } from "@tanstack/react-query";
import { Json } from "@/integrations/supabase/types";

export const useQuestionResponseHandler = (taskId: string) => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  const handleQuestionResponse = async (responses: Record<string, string>) => {
    if (!responses || Object.keys(responses).length === 0) {
      return false;
    }

    try {
      const { data: latestTask, error: fetchError } = await supabase
        .from('tasks')
        .select('subtasks')
        .eq('id', taskId)
        .single();

      if (fetchError) throw fetchError;

      const currentSubtasks: SubTask[] = Array.isArray(latestTask?.subtasks) 
        ? JSON.parse(JSON.stringify(latestTask.subtasks))
        : [];
      
      const subtasksToAdd: SubTask[] = Object.values(responses)
        .filter(response => response.trim() !== '')
        .map(response => ({
          id: crypto.randomUUID(),
          content: response,
          completed: false
        }));

      const updatedSubtasks = [...currentSubtasks, ...subtasksToAdd];

      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          subtasks: JSON.parse(JSON.stringify(updatedSubtasks)) as Json
        })
        .eq('id', taskId);

      if (updateError) throw updateError;

      await queryClient.invalidateQueries({ queryKey: ['tasks'] });

      toast({
        title: "Success",
        description: "Task has been broken down into subtasks",
      });
      
      return true;
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
      return false;
    }
  };

  return handleQuestionResponse;
};