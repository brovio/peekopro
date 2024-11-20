import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task, SubTask } from "@/types/task";
import { Json } from "@/integrations/supabase/types";

interface RawTask {
  id: string;
  content: string;
  category: string | null;
  confidence: number;
  completed?: boolean;
  created_at: string;
  user_id: string;
  subtasks: Json;
  attachments: Json;
}

export const useTasksQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['tasks', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      return (data as RawTask[] || []).map(task => ({
        ...task,
        subtasks: Array.isArray(task.subtasks) 
          ? (task.subtasks as any[]).map(st => ({
              id: st.id,
              content: st.content,
              completed: st.completed
            })) as SubTask[]
          : []
      })) as Task[];
    },
    enabled: !!userId,
  });
};