import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import ApiKeyManager from "@/components/ui/ApiKeyManager";
import TaskGridContainer from "@/components/tasks/frog/TaskGridContainer";
import TaskBreakdownContainer from "@/components/flomigo/TaskBreakdownContainer";
import TaskQuestionsDialog from "@/components/tasks/questions/TaskQuestionsDialog";
import TaskDataProvider from "@/components/flomigo/TaskDataProvider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Flomigo = () => {
  const [task, setTask] = useState("");
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [breakdownTaskId, setBreakdownTaskId] = useState<string | null>(null);
  const [showOnlyBreakdown, setShowOnlyBreakdown] = useState(false);
  const [showApiManager, setShowApiManager] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleShowApiManager = () => {
    setShowApiManager(true);
  };

  const handleBreakdownComplete = async () => {
    setShowOnlyBreakdown(false);
    setBreakdownTaskId(null);
    setTask("");
    await queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
  };

  const handleStartBreakdown = (taskContent: string, taskId: string) => {
    setTask(taskContent);
    setBreakdownTaskId(taskId);
    setShowOnlyBreakdown(true);
  };

  const handleCategorySelect = async (taskId: string, category: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ category })
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      
      toast({
        title: "Task updated",
        description: `Task category changed to ${category}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleQuestionResponse = async (answers: Record<string, string>) => {
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
    }
  };

  return (
    <div className="min-h-screen bg-navy-900">
      <Header onShowApiManager={handleShowApiManager} />
      <div className="container mx-auto px-0.5 sm:px-8 py-2 sm:py-8 space-y-4 sm:space-y-8">
        <TaskDataProvider>
          {({ tasks, isLoading }) => {
            if (isLoading) {
              return (
                <div className="flex items-center justify-center h-screen">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              );
            }

            return !showOnlyBreakdown ? (
              <TaskGridContainer
                tasks={tasks}
                onCategorySelect={handleCategorySelect}
                onBreakdownStart={handleStartBreakdown}
              />
            ) : (
              <TaskBreakdownContainer
                task={task}
                breakdownTaskId={breakdownTaskId}
                onComplete={handleBreakdownComplete}
                onTaskChange={(value) => setTask(value)}
              />
            );
          }}
        </TaskDataProvider>

        {showApiManager && (
          <ApiKeyManager
            open={showApiManager}
            onOpenChange={setShowApiManager}
          />
        )}
        <TaskQuestionsDialog
          open={showQuestions}
          onOpenChange={setShowQuestions}
          questions={questions}
          onSubmit={handleQuestionResponse}
        />
      </div>
    </div>
  );
};

export default Flomigo;