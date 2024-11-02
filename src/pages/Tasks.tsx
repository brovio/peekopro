import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MindDump from "@/components/tasks/MindDump";
import CategoryListBox from "@/components/tasks/CategoryListBox";
import ApiKeyManager from "@/components/ui/ApiKeyManager";
import { useSettings } from "@/contexts/SettingsContext";
import { useState } from "react";
import { Task } from "@/types/task";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showApiManager, setShowApiManager] = useState(false);
  const { visibleCategories, categorySettings } = useSettings();

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category === category.toLowerCase());
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const moveTask = (taskId: string, category: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, category: category.toLowerCase() } : task
    ));
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
        <Navbar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground">Ross's Tasks</h1>
            </div>
            
            <div className="space-y-6">
              <MindDump tasks={tasks} onTasksChange={setTasks} />
              
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