import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { handleFunctionResponse } from "@/utils/supabaseHelpers";

export const useTaskBreakdown = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const { toast } = useToast();

  const handleDirectTest = async (task: string) => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('break-down-task', {
        body: { content: task, skipQuestions: true }
      });
      
      const data = await handleFunctionResponse(response);
      const steps = data.data || [];
      setSteps(steps.map((step: any) => step.text));
      
      toast({
        title: "Task breakdown completed",
        description: "Your task has been broken down into steps."
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

  const handleGuidedTest = async (task: string) => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('break-down-task', {
        body: { content: task, skipQuestions: false }
      });
      
      const data = await handleFunctionResponse(response);
      const questions = data.data || [];
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

  const handleQuestionResponse = async (task: string, answers: Record<string, string>) => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('break-down-task', {
        body: { content: task, skipQuestions: true, answers }
      });
      
      const data = await handleFunctionResponse(response);
      const steps = data.data || [];
      setSteps(steps.map((step: any) => step.text));
      setShowQuestions(false);
      
      toast({
        title: "Task breakdown completed with your input",
        description: "Your task has been broken down based on your answers."
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

  return {
    isLoading,
    steps,
    questions,
    showQuestions,
    setShowQuestions,
    handleDirectTest,
    handleGuidedTest,
    handleQuestionResponse
  };
};