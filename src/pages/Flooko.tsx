import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TaskQuestionsDialog from "@/components/tasks/questions/TaskQuestionsDialog";
import TaskBreakdown from "@/components/tasks/breakdown/TaskBreakdown";
import FrogTaskItem from "@/components/tasks/frog/FrogTaskItem";
import FrogTaskGrid from "@/components/tasks/frog/FrogTaskGrid";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import ApiKeyManager from "@/components/ui/ApiKeyManager";
import { Task } from "@/types/task";

type CategorizedTask = Pick<Task, 'id' | 'content' | 'category'>;

const Test = () => {
  const [task, setTask] = useState("");
  const [frogTask, setFrogTask] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [breakdownTaskId, setBreakdownTaskId] = useState<string | null>(null);
  const [showOnlyBreakdown, setShowOnlyBreakdown] = useState(false);
  const [showApiManager, setShowApiManager] = useState(false);
  const { toast } = useToast();
  const frogInputRef = useRef<HTMLInputElement>(null);
  const [placeholder, setPlaceholder] = useState("Monkey Minding Much?");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: categorizedTasks = [], isLoading: isLoadingTasks } = useQuery({
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
        category: task.category || "Uncategorized"
      })) as CategorizedTask[];
    },
    enabled: !!user?.id
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPlaceholder("come on now, THINK");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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

  const handleFrogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frogTask.trim() || !user?.id) return;
    
    try {
      const { data: newTask, error } = await supabase
        .from('tasks')
        .insert({
          content: frogTask,
          category: "Uncategorized",
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      setFrogTask("");
      
      if (frogInputRef.current) {
        frogInputRef.current.focus();
      }

      toast({
        title: "Task added",
        description: "New task has been created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      });
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
          <>
            <Card className="p-3 sm:p-6 bg-[#1A1F2C]">
              <h1 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 text-gray-100 text-center sm:text-left">
                Find The Frog 🐸 Getting Shit Done
              </h1>
              
              <form onSubmit={handleFrogSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    ref={frogInputRef}
                    placeholder={placeholder}
                    value={frogTask}
                    onChange={(e) => setFrogTask(e.target.value)}
                    className="flex-1 bg-[#2A2F3C] border-gray-700 text-gray-100"
                  />
                  <Button 
                    type="submit"
                    className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
                  >
                    Dump
                  </Button>
                </div>

                {categorizedTasks.length > 0 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      {categorizedTasks
                        .filter(task => task.category === "Uncategorized")
                        .map((task, index) => (
                          <FrogTaskItem
                            key={task.id}
                            task={task.content}
                            index={index}
                            onCategorySelect={(category) => handleCategorySelect(task.id, category)}
                          />
                        ))}
                    </div>

                    <FrogTaskGrid 
                      tasks={categorizedTasks.filter(task => task.category !== "Uncategorized")}
                      onBreakdownStart={handleStartBreakdown}
                    />
                  </div>
                )}
              </form>
            </Card>
          </>
        ) : (
          <TaskBreakdown
            task={task}
            steps={steps}
            isLoading={isLoading}
            taskId={breakdownTaskId || undefined}
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

export default Test;

