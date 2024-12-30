import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { FileText, Trash2, RefreshCw, GripVertical } from "lucide-react";
import TaskClassificationButtons from "./TaskClassificationButtons";
import { useCategoryContext } from "./context/CategoryContext";

interface TaskItemProps {
  task: Task;
  onDelete?: (taskId: string) => void;
  onMove?: (taskId: string, category: string) => void;
  dragHandle?: React.ReactNode;
}

const TaskItem = ({ task, onDelete, onMove, dragHandle }: TaskItemProps) => {
  const [showReclassify, setShowReclassify] = useState(false);
  const context = useCategoryContext();

  const handleDelete = () => {
    if (context.onTaskDelete) {
      context.onTaskDelete(task.id);
    } else if (onDelete) {
      onDelete(task.id);
    }
  };

  const handleMove = (category: string) => {
    if (context.onTaskMove) {
      context.onTaskMove(task.id, category);
    } else if (onMove) {
      onMove(task.id, category);
    }
    setShowReclassify(false);
  };

  return (
    <div className="group relative p-2 bg-[#2A2F3C] rounded-md text-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {dragHandle || (
            <div className="touch-none cursor-grab active:cursor-grabbing p-1">
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <FileText className="h-4 w-4 text-gray-400" />
          <span className="break-words whitespace-normal w-full">{task.content}</span>
        </div>
        <div className="flex gap-0.5 items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-gray-300"
            onClick={() => setShowReclassify(true)}
            title="Move Task"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 text-gray-300"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showReclassify && (
        <TaskClassificationButtons
          taskId={task.id}
          onMove={handleMove}
          onClose={() => setShowReclassify(false)}
        />
      )}
    </div>
  );
};

export default TaskItem;