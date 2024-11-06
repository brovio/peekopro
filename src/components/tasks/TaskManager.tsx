import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const TaskManager = () => {
  const { visibleCategories } = useSettings();
  const { user } = useAuth();
  
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Filter tasks to only show from visible categories
  const filteredTasks = tasks.filter(task => visibleCategories.includes(task.category));

  return (
    <Card className="bg-[#141e38] border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100">Task Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTasks.map((task) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskManager;