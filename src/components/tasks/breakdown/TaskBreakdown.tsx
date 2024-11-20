import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface TaskBreakdownProps {
  task: string;
  steps: string[];
  isLoading: boolean;
  onTaskChange: (value: string) => void;
  onDirectTest: () => void;
  onGuidedTest: () => void;
}

const TaskBreakdown = ({ 
  task, 
  steps, 
  isLoading, 
  onTaskChange, 
  onDirectTest, 
  onGuidedTest 
}: TaskBreakdownProps) => {
  return (
    <Card className="p-6 bg-[#1A1F2C]">
      <h1 className="text-2xl font-bold mb-6 text-gray-100">Breaking Shit Down (BDC!)</h1>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Enter a task (e.g., Install Notepad++)"
            value={task}
            onChange={(e) => onTaskChange(e.target.value)}
            className="flex-1 bg-[#2A2F3C] border-gray-700 text-gray-100"
          />
          <Button 
            onClick={onDirectTest}
            disabled={isLoading}
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Quick Breakdown"
            )}
          </Button>
          <Button 
            onClick={onGuidedTest}
            disabled={isLoading}
            variant="outline"
            className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#2A2F3C]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Guided Breakdown"
            )}
          </Button>
        </div>

        {steps.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-100">Steps:</h2>
            <ul className="list-decimal pl-5 space-y-2">
              {steps.map((step, index) => (
                <li key={index} className="text-gray-300">
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskBreakdown;