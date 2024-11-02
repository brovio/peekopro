import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, FileText, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClassifyTask } from "@/hooks/useClassifyTask";
import { Task } from "@/types/task";
import TaskClassificationButtons from "./TaskClassificationButtons";
import { Button } from "@/components/ui/button";

interface MindDumpProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const MindDump = ({ tasks, onTasksChange }: MindDumpProps) => {
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();
  const { classifyTask, isClassifying } = useClassifyTask();

  const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const content = inputValue.trim();
      if (!content) return;

      const newTask: Task = {
        id: crypto.randomUUID(),
        content,
        category: null,
        confidence: 0
      };

      const previousTasks = [...tasks];
      onTasksChange([newTask, ...tasks]);

      try {
        const classification = await classifyTask(content);
        if (classification.confidence > 0.8) {
          newTask.category = classification.category;
          newTask.confidence = classification.confidence;
          onTasksChange([newTask, ...previousTasks]);
          
          toast({
            title: "Task added",
            description: `Automatically classified as ${classification.category}`,
            action: (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onTasksChange(previousTasks);
                  toast({
                    title: "Task classification undone",
                  });
                }}
              >
                Undo
              </Button>
            ),
          });
        } else {
          toast({
            title: "Task added",
            description: "Added to Monkey Thoughts",
          });
        }
      } catch (error) {
        toast({
          title: "Classification failed",
          description: "Task added to Monkey Thoughts",
          variant: "destructive",
        });
      }
      
      setInputValue("");
    }
  };

  const handleManualClassification = (taskId: string, category: string) => {
    const previousTasks = [...tasks];
    onTasksChange(tasks.map(task => 
      task.id === taskId 
        ? { ...task, category: category.toLowerCase(), confidence: 1 }
        : task
    ));
    
    toast({
      title: "Task classified",
      description: `Manually classified as ${category}`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onTasksChange(previousTasks);
            toast({
              title: "Classification undone",
            });
          }}
        >
          Undo
        </Button>
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          placeholder="Empty your monkey mind..."
          className="h-12 bg-[#6a94ff] text-white border-none placeholder:text-white/70 pr-10"
          onKeyDown={handleSubmit}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-100">
          <FileText className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Monkey Thoughts</h2>
        </div>

        <div className="space-y-2">
          {tasks.filter(task => !task.category).map(task => (
            <div
              key={task.id}
              className={cn(
                "flex items-center justify-between py-3 px-4 rounded-md",
                "bg-[#141e38] hover:bg-[#1a2747] border border-gray-700"
              )}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-100">{task.content}</span>
              </div>
              <TaskClassificationButtons 
                taskId={task.id}
                onClassify={handleManualClassification}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MindDump;