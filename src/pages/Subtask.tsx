import { useState } from "react";
import TaskBreakdown from "@/components/tasks/breakdown/TaskBreakdown";
import Header from "@/components/layout/Header";

const Subtask = () => {
  const [showApiManager, setShowApiManager] = useState(false);

  return (
    <div className="min-h-screen bg-navy-900">
      <Header onShowApiManager={() => setShowApiManager(true)} />
      <div className="container mx-auto px-0.5 sm:px-8 py-2 sm:py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Subtask It!</h1>
        <TaskBreakdown 
          task=""
          steps={[]}
          isLoading={false}
          onTaskChange={() => {}}
          onDirectTest={() => {}}
          onGuidedTest={() => {}}
        />
      </div>
    </div>
  );
};

export default Subtask;