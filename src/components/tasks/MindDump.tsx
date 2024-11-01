import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowDown, File, HelpCircle, Timer, Users, MessageCircle, Home, User2, Lightbulb, AppWindow, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClassifyTask } from "@/hooks/useClassifyTask";
import { Task } from "@/types/task";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MindDumpProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const MindDump = ({ tasks, onTasksChange }: MindDumpProps) => {
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();
  const { classifyTask, isClassifying } = useClassifyTask();

  const handleSubmit = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const content = inputValue.trim();
      if (!content) return;

      const newTask: Task = {
        id: crypto.randomUUID(),
        content,
        category: null,
        confidence: 0
      };

      try {
        const classification = await classifyTask(content);
        if (classification.confidence > 0.8) {
          newTask.category = classification.category;
          newTask.confidence = classification.confidence;
        }
        
        onTasksChange([newTask, ...tasks]);
        setInputValue("");
        
        toast({
          title: "Task added",
          description: classification.confidence > 0.8 
            ? `Automatically classified as ${classification.category}`
            : "Added to Monkey Thoughts",
        });
      } catch (error) {
        toast({
          title: "Classification failed",
          description: "Task added to Monkey Thoughts",
          variant: "destructive",
        });
        onTasksChange([newTask, ...tasks]);
        setInputValue("");
      }
    }
  };

  const handleManualClassification = (taskId: string, category: string) => {
    onTasksChange(tasks.map(task => 
      task.id === taskId 
        ? { ...task, category: category.toLowerCase(), confidence: 1 }
        : task
    ));
    
    toast({
      title: "Task classified",
      description: `Manually classified as ${category}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Textarea
          placeholder="Empty your monkey mind..."
          className="min-h-[100px] bg-white text-gray-900 border-gray-200 resize-none pr-10"
          onKeyDown={handleSubmit}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <ArrowDown className="absolute right-3 bottom-3 h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-900">
          <File className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Monkey Thoughts</h2>
        </div>

        <div className="space-y-2">
          {tasks.filter(task => !task.category).map(task => (
            <div
              key={task.id}
              className={cn(
                "flex items-center justify-between py-3 px-4 rounded-md",
                "bg-white border border-gray-200"
              )}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-900">{task.content}</span>
              </div>

              <TooltipProvider>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleManualClassification(task.id, "Work Day")}
                      >
                        <Timer className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Work Day</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleManualClassification(task.id, "Delegate")}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delegate</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleManualClassification(task.id, "Discuss")}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Discuss</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleManualClassification(task.id, "Family")}
                      >
                        <Home className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Family</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleManualClassification(task.id, "Personal")}
                      >
                        <User2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Personal</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleManualClassification(task.id, "Ideas")}
                      >
                        <Lightbulb className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ideas</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleManualClassification(task.id, "App Ideas")}
                      >
                        <AppWindow className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>App Ideas</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleManualClassification(task.id, "Project Ideas")}
                      >
                        <Briefcase className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Project Ideas</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MindDump;