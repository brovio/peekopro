import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Enter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClassifyTask } from "@/hooks/useClassifyTask";
import { Task } from "@/types/task";
import TaskClassificationButtons from "./TaskClassificationButtons";
import MonkeyThoughtsBox from "./MonkeyThoughtsBox";

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

  const unclassifiedTasks = tasks.filter(task => !task.category);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          placeholder="Empty your monkey mind..."
          className="bg-[#653535] text-white border-none placeholder:text-white"
          onKeyDown={handleSubmit}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Enter className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
      </div>

      <MonkeyThoughtsBox 
        tasks={unclassifiedTasks}
        onTaskDelete={(taskId) => {
          onTasksChange(tasks.filter(t => t.id !== taskId));
        }}
        onTaskMove={(taskId, category) => {
          handleManualClassification(taskId, category);
        }}
      />
    </div>
  );
};

export default MindDump;