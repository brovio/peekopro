import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TaskQuestionsDialog from "@/components/tasks/questions/TaskQuestionsDialog";
import TaskBreakdown from "@/components/tasks/breakdown/TaskBreakdown";
import FrogTaskItem from "@/components/tasks/frog/FrogTaskItem";

const Test = () => {
  const [task, setTask] = useState("");
  const [frogTask, setFrogTask] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [frogTasks, setFrogTasks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const { toast } = useToast();
  const frogInputRef = useRef<HTMLInputElement>(null);
  const [placeholder, setPlaceholder] = useState("Monkey Minding Much?");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPlaceholder("come on now, THINK");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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

  const handleFrogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!frogTask.trim()) return;
    
    setFrogTasks(prev => [frogTask, ...prev]);
    setFrogTask("");
    if (frogInputRef.current) {
      frogInputRef.current.focus();
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
            >
              Dump
            </Button>
          </div>

          {frogTasks.length > 0 && (
            <div className="mt-6 space-y-2">
              {frogTasks.map((task, index) => (
                <FrogTaskItem key={index} task={task} index={index} />
              ))}
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