import { useState } from "react";
import { Task } from "@/types/task";
import TaskActionsMenu from "./menus/TaskActionsMenu";
import TaskClassificationButtons from "./TaskClassificationButtons";

interface TaskItemProps {
  task: Task;
  onDelete?: (taskId: string) => void;
  onMove?: (taskId: string, category: string) => void;
}

const TaskItem = ({ task, onDelete, onMove }: TaskItemProps) => {
  const [showReclassify, setShowReclassify] = useState(false);

  return (
    <div className="group relative p-2 bg-[#2A2F3C] rounded-md text-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="break-words whitespace-normal w-full">{task.content}</span>
        </div>
        <TaskActionsMenu
          onDelete={() => onDelete?.(task.id)}
          onReclassify={() => setShowReclassify(true)}
          onMove={() => setShowReclassify(true)}
        />
      </div>
      
      {showReclassify && (
        <TaskClassificationButtons
          taskId={task.id}
          onClose={() => setShowReclassify(false)}
          onMove={onMove}
        />
      )}
    </div>
  );
};

export default TaskItem;