import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const TaskManager = () => {
  const { visibleCategories } = useSettings();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const { data: tasks = [], error, isLoading } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user?.id || !isAuthenticated) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Error fetching tasks",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id && isAuthenticated,
    retry: (failureCount, error) => {
      // Only retry if it's not an authentication error
      if (error.message === 'User not authenticated') return false;
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (!isAuthenticated) {
    return (
      <Card className="bg-[#141e38] border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Task Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400">Please sign in to view your tasks.</div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-[#141e38] border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Task Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#141e38] border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Task Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-400">Failed to load tasks. Please try again later.</div>
        </CardContent>
      </Card>
    );
  }

  // Filter tasks to only show from visible categories
  const filteredTasks = tasks.filter(task => visibleCategories.includes(task.category));

  return (
    <Card className="bg-[#141e38] border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100">Task Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-gray-400">No tasks found.</div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-100">{task.content}</h3>
                    <p className="text-sm text-gray-400">{task.category}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-300">{task.confidence}%</span>
                </div>
                <Progress value={task.confidence} className="h-2" />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskManager;