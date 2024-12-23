import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Task, SubTask } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";

interface TaskDataProviderProps {
  children: (data: {
    tasks: Task[];
    isLoading: boolean;
  }) => React.ReactNode;
}

const TaskDataProvider = ({ children }: TaskDataProviderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['frog-tasks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        toast({
          title: "Error fetching tasks",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data.map(task => ({
        id: task.id,
        content: task.content,
        category: task.category || "Uncategorized",
        confidence: task.confidence || 0,
        completed: task.completed || false,
        created_at: task.created_at,
        user_id: task.user_id,
        subtasks: Array.isArray(task.subtasks) 
          ? (task.subtasks as any[]).map(st => ({
              id: st.id || '',
              content: st.content || '',
              completed: st.completed || false
            })) as SubTask[]
          : [],
        attachments: Array.isArray(task.attachments) 
          ? task.attachments.map(a => String(a))
          : [],
        breakdown_comments: task.breakdown_comments
      })) as Task[];
    },
    enabled: !!user?.id
  });

  return <>{children({ tasks, isLoading })}</>;
};

export default TaskDataProvider;