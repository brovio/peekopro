import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TaskQuestionsDialog from "@/components/tasks/questions/TaskQuestionsDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import ApiKeyManager from "@/components/ui/ApiKeyManager";
import { Task, SubTask } from "@/types/task";
import TaskGridContainer from "@/components/tasks/frog/TaskGridContainer";
import TaskBreakdownSection from "@/components/tasks/frog/TaskBreakdownSection";

const Flomigo = () => {
  const [task, setTask] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [breakdownTaskId, setBreakdownTaskId] = useState<string | null>(null);
  const [showOnlyBreakdown, setShowOnlyBreakdown] = useState(false);
  const [showApiManager, setShowApiManager] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['frog-tasks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        toast({
          title: "Error fetching tasks",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data.map(task => ({
        id: task.id,
        content: task.content,
        category: task.category || "Uncategorized",
        confidence: task.confidence || 0,
        completed: task.completed || false,
        created_at: task.created_at,
        user_id: task.user_id,
        subtasks: Array.isArray(task.subtasks) 
          ? (task.subtasks as any[]).map(st => ({
              id: st.id || '',
              content: st.content || '',
              completed: st.completed || false
            })) as SubTask[]
          : [],
        attachments: Array.isArray(task.attachments) 
          ? task.attachments.map(a => String(a))
          : [],
        breakdown_comments: task.breakdown_comments
      })) as Task[];
    },
    enabled: !!user?.id
  });

  const handleShowApiManager = () => {
    setShowApiManager(true);
  };

  const handleBreakdownComplete = async () => {
    setShowOnlyBreakdown(false);
    setBreakdownTaskId(null);
    setTask("");
    setSteps([]);
    await queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
  };

  const handleStartBreakdown = (taskContent: string, taskId: string) => {
    setTask(taskContent);
    setBreakdownTaskId(taskId);
    setShowOnlyBreakdown(true);
  };

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

  if (isLoadingTasks) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <Header onShowApiManager={handleShowApiManager} />
      <div className="container mx-auto px-0.5 sm:px-8 py-2 sm:py-8 space-y-4 sm:space-y-8">
        {!showOnlyBreakdown ? (
          <TaskGridContainer
            tasks={tasks}
            onCategorySelect={handleCategorySelect}
            onBreakdownStart={handleStartBreakdown}
          />
        ) : (
          <TaskBreakdownSection
            task={task}
            steps={steps}
            isLoading={isLoading}
            breakdownTaskId={breakdownTaskId}
            onTaskChange={(value) => setTask(value)}
            onDirectTest={handleDirectTest}
            onGuidedTest={handleGuidedTest}
            onComplete={handleBreakdownComplete}
          />
        )}

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