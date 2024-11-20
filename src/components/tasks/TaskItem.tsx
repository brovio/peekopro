import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { FileText, Trash2, ArrowRight, User, Check, RefreshCw } from "lucide-react";
import TaskClassificationButtons from "./TaskClassificationButtons";
import TaskBreakdownButtons from "./ai-breakdown/TaskBreakdownButtons";
import SubtasksList from "./subtasks/SubtasksList";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Json } from "@/integrations/supabase/types";

interface TaskItemProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onMove?: (taskId: string, category: string) => void;
  onAddSubtask?: (taskId: string) => void;
}

const TaskItem = ({ task, onDelete, onMove, onAddSubtask }: TaskItemProps) => {
  const [showReclassify, setShowReclassify] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-2">
      <div
        className="group flex items-center justify-between p-3 rounded-md bg-[#1a2747] hover:bg-[#1f2f52] border border-gray-700 transition-all"
      >
        <div className="flex items-center gap-3">
          <button className="opacity-60 hover:opacity-100">
            <FileText className="h-4 w-4 text-gray-300" />
          </button>
          <span className="text-sm text-gray-100">{task.content}</span>
          {task.subtasks && task.subtasks.length > 0 && (
            <span className="text-xs text-gray-400">
              ({task.subtasks.length} subtasks)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
          {showReclassify ? (
            <TaskClassificationButtons
              taskId={task.id}
              onClassify={(taskId, category) => {
                onMove?.(taskId, category);
                setShowReclassify(false);
              }}
            />
          ) : (
            <>
              {onAddSubtask && (
                <TaskBreakdownButtons
                  task={task}
                  onAddSubtask={onAddSubtask}
                />
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-[#243156]"
                onClick={() => setShowReclassify(true)}
                title="Reclassify"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-[#243156]"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-[#243156]"
                onClick={() => onMove?.(task.id, "Discuss")}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-[#243156]"
                onClick={() => onMove?.(task.id, "Delegate")}
              >
                <User className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-[#243156]"
                onClick={() => onMove?.(task.id, "Complete")}
              >
                <Check className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {task.subtasks && task.subtasks.length > 0 && (
        <SubtasksList
          subtasks={task.subtasks}
          onComplete={async (subtaskId, completed) => {
            try {
              const updatedSubtasks = task.subtasks.map(subtask =>
                subtask.id === subtaskId ? { ...subtask, completed } : subtask
              );

              const { error } = await supabase
                .from('tasks')
                .update({ 
                  subtasks: JSON.parse(JSON.stringify(updatedSubtasks)) as Json 
                })
                .eq('id', task.id);

              if (error) throw error;

              // Update the cache immediately to prevent flicker
              queryClient.setQueryData(['tasks'], (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.map((t: Task) =>
                  t.id === task.id ? { ...t, subtasks: updatedSubtasks } : t
                );
              });

              toast({
                title: completed ? "Subtask completed" : "Subtask uncompleted",
                description: "Progress updated successfully",
              });
            } catch (error: any) {
              toast({
                title: "Error",
                description: "Failed to update subtask status",
                variant: "destructive",
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default TaskItem;