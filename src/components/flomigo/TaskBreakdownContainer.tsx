import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import TaskBreakdownSection from "@/components/tasks/frog/TaskBreakdownSection";
import { supabase } from "@/integrations/supabase/client";

interface TaskBreakdownContainerProps {
  task: string;
  breakdownTaskId: string | null;
  onComplete: () => Promise<void>;
  onTaskChange: (value: string) => void;
}

const TaskBreakdownContainer = ({ 
  task, 
  breakdownTaskId, 
  onComplete, 
  onTaskChange 
}: TaskBreakdownContainerProps) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const { toast } = useToast();

  const handleDirectTest = async () => {
    if (!task.trim()) {
      toast({
        title: "Please enter a task",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { data: steps }, error } = await supabase.functions.invoke('break-down-task', {
        body: { 
          content: task,
          skipQuestions: true
        }
      });

      if (error) throw error;

      if (!steps || !Array.isArray(steps)) {
        throw new Error('Invalid response format from AI service');
      }

      setSteps(steps.map(step => step.text));
      toast({
        title: "Success",
        description: "Task breakdown completed",
      });
    } catch (error: any) {
      console.error('Test page error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to break down task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuidedTest = async () => {
    if (!task.trim()) {
      toast({
        title: "Please enter a task",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { data: questions }, error } = await supabase.functions.invoke('break-down-task', {
        body: { 
          content: task,
          skipQuestions: false
        }
      });

      if (error) throw error;

      if (!questions || !Array.isArray(questions)) {
        throw new Error('Invalid response format from AI service');
      }

      setQuestions(questions);
      setShowQuestions(true);
    } catch (error: any) {
      console.error('Test page error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get questions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TaskBreakdownSection
      task={task}
      steps={steps}
      isLoading={isLoading}
      breakdownTaskId={breakdownTaskId}
      onTaskChange={onTaskChange}
      onDirectTest={handleDirectTest}
      onGuidedTest={handleGuidedTest}
      onComplete={onComplete}
    />
  );
};

export default TaskBreakdownContainer;