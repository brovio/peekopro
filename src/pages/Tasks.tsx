import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MindDump from "@/components/tasks/MindDump";
import CategoryListBox from "@/components/tasks/CategoryListBox";
import ApiKeyManager from "@/components/ui/ApiKeyManager";
import { useSettings } from "@/contexts/SettingsContext";
import { useState } from "react";
import { Task, SubTask, TaskInput } from "@/types/task";
import { useTaskHistory } from "@/hooks/useTaskHistory";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Tasks = () => {
  const [showApiManager, setShowApiManager] = useState(false);
  const { visibleCategories, categorySettings } = useSettings();
  const { pushState, undo, redo, canUndo, canRedo } = useTaskHistory();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return (data || []).map(task => ({
        ...task,
        subtasks: task.subtasks ? (task.subtasks as unknown as SubTask[]) : null
      })) as Task[];
    },
    enabled: !!user?.id,
    retry: 3
  });

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates as TaskInput)
        .eq('id', taskId);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Failed to delete task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const moveTask = async (taskId: string, category: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ category: category.toLowerCase() })
        .eq('id', taskId);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Failed to move task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const sortedCategories = [
    "Work Day",
    "Delegate",
    "Discuss",
    "Family",
    "Personal",
    "Ideas",
    "App Ideas",
    "Project Ideas",
    "Meetings",
    "Follow-Up",
    "Urgent",
    "Complete"
  ].sort((a, b) => 
    (categorySettings[a]?.order || 0) - (categorySettings[b]?.order || 0)
  );

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category?.toLowerCase() === category.toLowerCase());
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error loading tasks: {error.message}</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onShowApiManager={() => setShowApiManager(true)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground">Ross's Tasks</h1>
            </div>
            
            <div className="space-y-6">
              <MindDump tasks={tasks} onTasksChange={(newTasks) => {
                console.log('Tasks updated:', newTasks);
              }} />
              
              <div className="space-y-6">
                {sortedCategories.map(category => (
                  visibleCategories.includes(category) && (
                    <CategoryListBox
                      key={category}
                      title={category}
                      tasks={getTasksByCategory(category)}
                      onTaskUpdate={updateTask}
                      onTaskDelete={deleteTask}
                      onTaskMove={moveTask}
                    />
                  )
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <ApiKeyManager 
        open={showApiManager} 
        onOpenChange={setShowApiManager}
      />
    </div>
  );
};

export default Tasks;
