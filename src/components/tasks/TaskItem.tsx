import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { FileText, Trash2, ArrowRight, User, Check, RefreshCw } from "lucide-react";
import TaskClassificationButtons from "./TaskClassificationButtons";

interface TaskItemProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onMove?: (taskId: string, category: string) => void;
}

const TaskItem = ({ task, onDelete, onMove }: TaskItemProps) => {
  const [showReclassify, setShowReclassify] = useState(false);

  return (
    <div
      className="group flex items-center justify-between p-3 rounded-md bg-[#1a2747] hover:bg-[#1f2f52] border border-gray-700 transition-all"
    >
      <div className="flex items-center gap-3">
        <button className="opacity-60 hover:opacity-100">
          <FileText className="h-4 w-4 text-gray-300" />
        </button>
        <span className="text-sm text-gray-100">{task.content}</span>
      </div>
      <div className="flex items-center opacity-100 group-hover:opacity-100 transition-opacity bg-[#243156] rounded-md px-1">
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-gray-300 hover:text-gray-100"
              onClick={() => setShowReclassify(true)}
              title="Reclassify"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-gray-300 hover:text-gray-100"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-gray-300 hover:text-gray-100"
              onClick={() => onMove?.(task.id, "Discuss")}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-gray-300 hover:text-gray-100"
              onClick={() => onMove?.(task.id, "Delegate")}
            >
              <User className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-gray-300 hover:text-gray-100"
              onClick={() => onMove?.(task.id, "Complete")}
            >
              <Check className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;