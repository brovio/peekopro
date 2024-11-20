import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TaskQuestionsDialog from "@/components/tasks/questions/TaskQuestionsDialog";

export const AITestSection = () => {
  const [task, setTask] = useState("");
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

  const handleQuestionResponse = async (answers: Record<string, string>) => {
    setIsLoading(true);
    try {
      const { data: { data: steps }, error } = await supabase.functions.invoke('break-down-task', {
        body: { 
          content: task,
          skipQuestions: true,
          answers
        }
      });

      if (error) throw error;

      if (!steps || !Array.isArray(steps)) {
        throw new Error('Invalid response format from AI service');
      }

      setSteps(steps.map(step => step.text));
      setShowQuestions(false);
      toast({
        title: "Success",
        description: "Task breakdown completed with your input",
      });
    } catch (error: any) {
      console.error('Test page error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process answers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Enter a task to test AI breakdown"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleDirectTest}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Quick Breakdown"
          )}
        </Button>
        <Button 
          onClick={handleGuidedTest}
          disabled={isLoading}
          variant="outline"
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
          <h2 className="text-lg font-semibold mb-3">Steps:</h2>
          <ul className="list-decimal pl-5 space-y-2">
            {steps.map((step, index) => (
              <li key={index} className="text-muted-foreground">
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      <TaskQuestionsDialog
        open={showQuestions}
        onOpenChange={setShowQuestions}
        questions={questions}
        onSubmit={handleQuestionResponse}
      />
    </div>
  );
};