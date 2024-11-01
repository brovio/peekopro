import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MindDump from "@/components/tasks/MindDump";
import { useState } from "react";
import { Task } from "@/types/task";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
            </div>
            
            <div className="space-y-6">
              <MindDump tasks={tasks} onTasksChange={setTasks} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;