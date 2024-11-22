import { useState } from "react";
import TaskBreakdown from "@/components/tasks/breakdown/TaskBreakdown";
import Header from "@/components/layout/Header";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import BreakdownSettings from "@/components/tasks/breakdown/BreakdownSettings";

const Subtask = () => {
  const [showApiManager, setShowApiManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [task, setTask] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDirectTest = async () => {
    setIsLoading(true);
    // Implementation for direct test will go here
    setIsLoading(false);
  };

  const handleGuidedTest = async () => {
    setIsLoading(true);
    // Implementation for guided test will go here
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy-900">
      <Header onShowApiManager={() => setShowApiManager(true)} />
      <div className="container mx-auto px-0.5 sm:px-8 py-2 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Subtask It!</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="hover:bg-gray-800/50"
          >
            <Settings className="h-5 w-5 text-gray-300" />
          </Button>
        </div>
        
        <TaskBreakdown 
          task={task}
          steps={steps}
          isLoading={isLoading}
          onTaskChange={setTask}
          onDirectTest={handleDirectTest}
          onGuidedTest={handleGuidedTest}
        />
      </div>
      
      <BreakdownSettings
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </div>
  );
};

export default Subtask;