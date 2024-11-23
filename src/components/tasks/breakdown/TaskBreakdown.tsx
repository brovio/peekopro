import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import StepsList from "./StepsList";

interface TaskBreakdownProps {
  task: string;
  steps: string[];
  isLoading: boolean;
  taskId?: string | undefined;
  provider?: string;
  model?: string;
  onTaskChange: (value: string) => void;
  onDirectTest: () => void;
  onGuidedTest: () => void;
  onComplete?: () => void;
}

const TaskBreakdown = ({ 
  task, 
  steps, 
  isLoading, 
  taskId,
  provider = 'openai',
  model = 'gpt-4o-mini',
  onTaskChange,
  onDirectTest, 
  onGuidedTest,
  onComplete,
}: TaskBreakdownProps) => {
  const [isImproving, setIsImproving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleImprovePrompt = async () => {
    if (!task.trim() || !user) return;
    
    setIsImproving(true);
    try {
      const { data, error } = await supabase.functions.invoke('improve-prompt', {
        body: { 
          prompt: task,
          provider,
          model
        }
      });

      if (error) throw error;

      if (data.improvedPrompt) {
        onTaskChange(data.improvedPrompt);
        toast({
          title: "Text cleaned up",
          description: "Spelling and grammar have been improved",
        });
      }
    } catch (error: any) {
      console.error('Error improving text:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to improve text",
        variant: "destructive",
      });
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6 bg-[#1A1F2C]">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-100 text-center">
        Breaking Shit Down (BDC!)
      </h1>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Enter a task to break down (e.g., Install Notepad++)"
              value={task}
              onChange={(e) => onTaskChange(e.target.value)}
              className="flex-1 bg-[#2A2F3C] border-gray-700 text-gray-100"
            />
            <Button
              onClick={handleImprovePrompt}
              disabled={isImproving || !task.trim()}
              variant="outline"
              className="w-full sm:w-auto bg-gradient-to-r from-[#33C3F0] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#33C3F0] text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              {isImproving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-white" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2 text-white" />
              )}
              Fix Spelling & Grammar
            </Button>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Button 
              onClick={onDirectTest}
              disabled={isLoading || !task.trim()}
              className="flex-1 sm:flex-none bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Quick Breakdown"
              )}
            </Button>
            <Button 
              onClick={onGuidedTest}
              disabled={isLoading || !task.trim()}
              variant="outline"
              className="flex-1 sm:flex-none border-[#9b87f5] text-[#9b87f5] hover:bg-[#2A2F3C]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Guided Breakdown"
              )}
            </Button>
          </div>
        </div>

        {steps.length > 0 && <StepsList steps={steps} />}
      </div>
    </Card>
  );
};

export default TaskBreakdown;