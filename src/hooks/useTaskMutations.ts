import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import { Json } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

export const useTaskMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!userId) return;

    try {
      const updateData = {
        ...updates,
        subtasks: updates.subtasks ? JSON.parse(JSON.stringify(updates.subtasks)) as Json : undefined,
        attachments: updates.attachments ? JSON.parse(JSON.stringify(updates.attachments)) as Json : undefined
      };

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    } catch (error: any) {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    } catch (error: any) {
      toast({
        title: "Failed to delete task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const moveTask = async (taskId: string, category: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ category: category.toLowerCase() })
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    } catch (error: any) {
      toast({
        title: "Failed to move task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { updateTask, deleteTask, moveTask };
};