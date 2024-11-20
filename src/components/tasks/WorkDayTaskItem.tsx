import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { Clock, Plus, Trash2, Zap, Check, Brain } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WorkDayTaskItemProps {
  task: Task;
  onAddSubtask: (taskId: string) => void;
  onGenerateAISubtasks: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const WorkDayTaskItem = ({ task, onAddSubtask, onGenerateAISubtasks, onDelete }: WorkDayTaskItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAIBreakdown = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('break-down-task', {
        body: { taskContent: task.content }
      });

      if (error) throw error;

      if (data.steps && data.steps.length > 0) {
        const subtasks = data.steps.map(step => ({
          id: crypto.randomUUID(),
          content: step,
          completed: false
        }));

        await onGenerateAISubtasks(task.id);

        if (data.questions && data.questions.length > 0) {
          toast({
            title: "Additional Questions",
            description: (
              <div className="mt-2 space-y-2">
                {data.questions.map((q: string, i: number) => (
                  <p key={i} className="text-sm">• {q}</p>
                ))}
              </div>
            ),
            duration: 10000,
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error breaking down task",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-3 rounded-md bg-[#1a2747] hover:bg-[#1f2f52] border border-gray-700">
        <div className="flex items-center gap-3">
          <button className="opacity-60 hover:opacity-100">
            <Clock className="h-4 w-4 text-gray-300" />
          </button>
          <span className="text-sm text-gray-100">{task.content}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onAddSubtask(task.id)}
            title="Add Subtask"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleAIBreakdown}
            disabled={isLoading}
            title="AI Breakdown"
          >
            <Brain className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onGenerateAISubtasks(task.id)}
            title="Generate AI Subtasks"
          >
            <Zap className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="ml-6 space-y-2">
          {task.subtasks.map(subtask => (
            <div
              key={subtask.id}
              className="flex items-center justify-between p-2 rounded-md bg-[#1a2747]/50 border border-gray-700"
            >
              <span className="text-sm text-gray-300">{subtask.content}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {/* Handle subtask completion */}}
              >
                <Check className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkDayTaskItem;