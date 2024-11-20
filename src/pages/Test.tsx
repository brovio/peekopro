import { Card } from "@/components/ui/card";
import MindDump from "@/components/tasks/MindDump";
import TaskTestList from "@/components/tasks/test/TaskTestList";
import { AITestSection } from "@/components/test/AITestSection";
import { useTestTasks } from "@/hooks/useTestTasks";

const Test = () => {
  const { tasks, handleTasksChange } = useTestTasks();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="p-6 bg-card">
        <h1 className="text-2xl font-bold mb-6">Mind Dump & Task Management</h1>
        
        <div className="space-y-8">
          <MindDump 
            tasks={tasks} 
            onTasksChange={handleTasksChange}
          />

          <TaskTestList
            tasks={tasks}
          />
        </div>
      </Card>

      <Card className="p-6 bg-card">
        <h2 className="text-xl font-bold mb-6">AI Task Breakdown Testing</h2>
        <AITestSection />
      </Card>
    </div>
  );
};

export default Test;