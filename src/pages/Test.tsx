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

interface CategorizedTask {
  id: string;
  content: string;
  category: string;
}

const Test = () => {
  const [task, setTask] = useState("");
  const [frogTask, setFrogTask] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const { toast } = useToast();
  const frogInputRef = useRef<HTMLInputElement>(null);
  const [placeholder, setPlaceholder] = useState("Monkey Minding Much?");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch tasks from Supabase
  const { data: tasks = [] } = useQuery({
    queryKey: ['frog-tasks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: "Error fetching tasks",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as CategorizedTask[];
    },
    enabled: !!user?.id
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPlaceholder("come on now, THINK");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDirectTest = async () => {
    // Simulated breakdown logic
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('break-down-task', { body: { content: task, skipQuestions: true } });
      const data = await response.json();
      const steps = data.data || [];
      setSteps(steps.map(step => step.text));
      toast({ title: "Task breakdown completed", description: "Your task has been broken down into steps." });
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
    // Simulated guided breakdown logic
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('break-down-task', { body: { content: task, skipQuestions: false } });
      const data = await response.json();
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

  const handleQuestionResponse = async (answers: Record<string, string>) => {
    // Simulated question response logic
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('break-down-task', { body: { content: task, skipQuestions: true, answers } });
      const data = await response.json();
      const steps = data.data || [];
      setSteps(steps.map(step => step.text));
      setShowQuestions(false);
      toast({ title: "Task breakdown completed with your input", description: "Your task has been broken down based on your answers." });
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
    if (!frogTask.trim() || !user) return;
    
    try {
      const { data: newTask, error } = await supabase
        .from('tasks')
        .insert({
          content: frogTask.trim(),
          user_id: user.id,
          category: null
        })
        .select()
        .single();

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      setFrogTask("");
      
      if (frogInputRef.current) {
        frogInputRef.current.focus();
      }

      toast({
        title: "Task added",
        description: "Your task has been saved successfully.",
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
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ category: category.toLowerCase() })
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      
      toast({
        title: "Task updated",
        description: `Task moved to ${category}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <TaskBreakdown
        task={task}
        steps={steps}
        isLoading={isLoading}
        onTaskChange={(value) => setTask(value)}
        onDirectTest={handleDirectTest}
        onGuidedTest={handleGuidedTest}
      />

      <Card className="p-6 bg-[#1A1F2C]">
        <h1 className="text-2xl font-bold mb-6 text-gray-100">Find The Frog 🐸 Getting Shit Done</h1>
        
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
              disabled={!user}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Dump"}
            </Button>
          </div>

          {tasks.length > 0 && (
            <div className="space-y-8">
              <div className="space-y-2">
                {tasks
                  .filter(task => !task.category)
                  .map((task, index) => (
                    <FrogTaskItem
                      key={task.id}
                      task={task.content}
                      index={index}
                      onCategorySelect={(category) => handleCategorySelect(task.id, category)}
                    />
                  ))}
              </div>

              <FrogTaskGrid tasks={tasks.filter(task => task.category)} />
            </div>
          )}
        </form>
      </Card>

      <TaskQuestionsDialog
        open={showQuestions}
        onOpenChange={setShowQuestions}
        questions={questions}
        onSubmit={handleQuestionResponse}
      />
    </div>
  );
};

export default Test;
