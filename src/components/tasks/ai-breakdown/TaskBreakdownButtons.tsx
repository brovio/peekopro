import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import TaskQuestionsDialog from "../questions/TaskQuestionsDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/task";

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
      const { data: { data: steps }, error } = await supabase.functions.invoke('break-down-task', {
        body: { 
          content: task.content,
          skipQuestions: true
        }
      });

      if (error) throw error;

      if (!steps || !Array.isArray(steps)) {
        throw new Error('Invalid response format from AI service');
      }

      const newSubtasks = steps.map(step => ({
        id: crypto.randomUUID(),
        content: step.text,
        completed: false
      }));

      // Add each step as a subtask
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          subtasks: JSON.parse(JSON.stringify(newSubtasks))
        })
        .eq('id', task.id);

      if (updateError) throw updateError;

      // Update the cache immediately
      queryClient.setQueryData(['tasks'], (oldData: any) => {
        if (!Array.isArray(oldData)) return oldData;
        return oldData.map((t: Task) =>
          t.id === task.id ? { ...t, subtasks: newSubtasks } : t
        );
      });

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
      const { data: { data: questions }, error } = await supabase.functions.invoke('break-down-task', {
        body: { 
          content: task.content,
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
          content: task.content,
          skipQuestions: true,
          answers
        }
      });

      if (error) throw error;

      if (!steps || !Array.isArray(steps)) {
        throw new Error('Invalid response format from AI service');
      }

      const newSubtasks = steps.map(step => ({
        id: crypto.randomUUID(),
        content: step.text,
        completed: false
      }));

      // Add each step as a subtask
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          subtasks: JSON.parse(JSON.stringify(newSubtasks))
        })
        .eq('id', task.id);

      if (updateError) throw updateError;

      // Update the cache immediately
      queryClient.setQueryData(['tasks'], (oldData: any) => {
        if (!Array.isArray(oldData)) return oldData;
        return oldData.map((t: Task) =>
          t.id === task.id ? { ...t, subtasks: newSubtasks } : t
        );
      });

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