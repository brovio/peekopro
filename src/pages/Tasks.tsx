import MindDump from "@/components/tasks/MindDump";
import CategoryListBox from "@/components/tasks/CategoryListBox";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useSettings } from "@/contexts/SettingsContext";
import { useState } from "react";
import { Task } from "@/types/task";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { visibleCategories } = useSettings();

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => 
      category === "Monkey Thoughts" 
        ? !task.category 
        : task.category === category.toLowerCase()
    );
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  return (
    <div className="flex h-screen bg-navy-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-white">Tasks</h1>
            </div>
            
            <div className="space-y-6">
              <MindDump />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {["Work Day", "Delegate", "Discuss", "Family", "Personal", "Ideas", "App Ideas", "Project Ideas", "Monkey Thoughts"].map(category => (
                  visibleCategories.includes(category) && (
                    <CategoryListBox
                      key={category}
                      title={category}
                      tasks={getTasksByCategory(category)}
                      onTaskUpdate={updateTask}
                    />
                  )
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;