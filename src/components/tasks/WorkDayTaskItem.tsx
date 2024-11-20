import { Task } from "@/types/task";
import { Clock } from "lucide-react";
import { useState } from "react";
import TaskClassificationButtons from "./TaskClassificationButtons";
import TaskActions from "./actions/TaskActions";
import SubtasksList from "./subtasks/SubtasksList";
import TaskBreakdownButtons from "./ai-breakdown/TaskBreakdownButtons";

interface WorkDayTaskItemProps {
  task: Task;
  onAddSubtask: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onMove?: (taskId: string, category: string) => void;
}

const WorkDayTaskItem = ({ task, onAddSubtask, onDelete, onMove }: WorkDayTaskItemProps) => {
  const [showReclassify, setShowReclassify] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-2 p-2 rounded-lg bg-gray-800 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-100">{task.content}</span>
            {task.subtasks && task.subtasks.length > 0 && (
              <span className="text-xs text-gray-400">
                ({task.subtasks.length} subtasks)
              </span>
            )}
          </div>
          
          {showReclassify ? (
            <TaskClassificationButtons
              taskId={task.id}
              onClassify={(taskId, category) => {
                onMove?.(taskId, category);
                setShowReclassify(false);
              }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <TaskBreakdownButtons
                task={task}
                onAddSubtask={onAddSubtask}
              />
              <TaskActions
                onReclassify={() => setShowReclassify(true)}
                onDelete={() => onDelete(task.id)}
              />
            </div>
          )}
        </div>

        <SubtasksList
          subtasks={Array.isArray(task.subtasks) ? task.subtasks : []}
          onComplete={async (subtaskId, completed) => {
            try {
              const currentSubtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
              
              const updatedSubtasks = currentSubtasks.map(subtask => 
                subtask.id === subtaskId ? { ...subtask, completed } : subtask
              );

              const { error } = await supabase
                .from('tasks')
                .update({
                  subtasks: JSON.parse(JSON.stringify(updatedSubtasks)) as Json
                })
                .eq('id', task.id);

              if (error) throw error;

              await queryClient.invalidateQueries({ queryKey: ['tasks'] });

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
      </div>
    </>
  );
};

export default WorkDayTaskItem;
