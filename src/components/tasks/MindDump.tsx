import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowDown, File, QuestionMark, Trash2, Edit, User, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClassifyTask } from "@/hooks/useClassifyTask";

interface Task {
  id: string;
  content: string;
  category: string | null;
  confidence: number;
}

const MindDump = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const { classifyTask, isClassifying } = useClassifyTask();

  const handleSubmit = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const content = e.currentTarget.value.trim();
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
        
        setTasks(prev => [newTask, ...prev]);
        e.currentTarget.value = "";
        
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
        setTasks(prev => [newTask, ...prev]);
        e.currentTarget.value = "";
      }
    }
  };

  const handleManualClassification = (taskId: string, category: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, category, confidence: 1 }
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
          className="min-h-[100px] bg-navy-900 text-white border-gray-700 resize-none pr-10"
          onKeyDown={handleSubmit}
        />
        <ArrowDown className="absolute right-3 bottom-3 h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <File className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Monkey Thoughts</h2>
        </div>

        <div className="space-y-2">
          {tasks.map(task => (
            <div
              key={task.id}
              className={cn(
                "flex items-center justify-between py-3 px-4 rounded-md",
                "bg-navy-800 border border-gray-700"
              )}
            >
              <div className="flex items-center gap-2">
                {!task.category && <QuestionMark className="h-4 w-4 text-yellow-500" />}
                <span className="text-white">{task.content}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() => handleManualClassification(task.id, "delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() => handleManualClassification(task.id, "work")}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() => handleManualClassification(task.id, "personal")}
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() => handleManualClassification(task.id, "done")}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() => handleManualClassification(task.id, "later")}
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MindDump;