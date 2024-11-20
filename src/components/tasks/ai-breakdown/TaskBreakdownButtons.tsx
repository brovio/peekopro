import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import TaskQuestionsDialog from "../questions/TaskQuestionsDialog";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/task";
import { getAIBreakdown } from "./services/aiService";
import { handleAIResponse } from "./utils/handleAIResponse";

interface TaskBreakdownButtonsProps {
  task: Task;
  onAddSubtask: (taskId: string) => void;
}

const TaskBreakdownButtons = ({ task, onAddSubtask }: TaskBreakdownButtonsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDirectBreakdown = async () => {
    setIsLoading(true);
    try {
      const steps = await getAIBreakdown(task.content, true);
      await handleAIResponse(steps, task.id, queryClient);
      onAddSubtask(task.id);

      toast({
        title: "Success",
        description: "Task has been broken down into subtasks",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to break down task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuidedBreakdown = async () => {
    setIsLoading(true);
    try {
      const questions = await getAIBreakdown(task.content, false);
      setQuestions(questions);
      setShowQuestions(true);
    } catch (error: any) {
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
      const steps = await getAIBreakdown(task.content, true, answers);
      await handleAIResponse(steps, task.id, queryClient);
      onAddSubtask(task.id);
      setShowQuestions(false);

      toast({
        title: "Success",
        description: "Task has been broken down with your input",
      });
    } catch (error: any) {
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
    <>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={handleDirectBreakdown}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Quick Breakdown"
          )}
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleGuidedBreakdown}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Guided Breakdown"
          )}
        </Button>
      </div>

      <TaskQuestionsDialog
        open={showQuestions}
        onOpenChange={setShowQuestions}
        questions={questions}
        onSubmit={handleQuestionResponse}
      />
    </>
  );
};

export default TaskBreakdownButtons;