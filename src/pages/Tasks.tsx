import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MindDump from "@/components/tasks/MindDump";
import CategoryListBox from "@/components/tasks/CategoryListBox";
import ApiKeyManager from "@/components/ui/ApiKeyManager";
import { useSettings } from "@/contexts/SettingsContext";
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { useTaskHistory } from "@/hooks/useTaskHistory";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showApiManager, setShowApiManager] = useState(false);
  const { visibleCategories, categorySettings } = useSettings();
  const { pushState, undo, redo, canUndo, canRedo } = useTaskHistory();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        handleUndo();
      } else if (e.ctrlKey && e.key === 'y') {
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      setTasks(previousState);
      toast({
        title: "Action undone",
        description: "Previous action has been reversed",
      });
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setTasks(nextState);
      toast({
        title: "Action redone",
        description: "Action has been reapplied",
      });
    }
  };

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    pushState(newTasks);
  };

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category === category.toLowerCase());
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const newTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    updateTasks(newTasks);
  };

  const deleteTask = (taskId: string) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    updateTasks(newTasks);
  };

  const moveTask = (taskId: string, category: string) => {
    const newTasks = tasks.map(task =>
      task.id === taskId ? { ...task, category: category.toLowerCase() } : task
    );
    updateTasks(newTasks);
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onShowApiManager={() => setShowApiManager(true)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground">Ross's Tasks</h1>
            </div>
            
            <div className="space-y-6">
              <MindDump tasks={tasks} onTasksChange={updateTasks} />
              
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