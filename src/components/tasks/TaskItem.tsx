import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { FileText, Trash2, ArrowRight, User, Check, RefreshCw, MoveHorizontal } from "lucide-react";
import TaskClassificationButtons from "./TaskClassificationButtons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <div className="flex gap-0.5 items-center invisible group-hover:visible">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7 text-gray-300 hover:text-gray-100"
              >
                <MoveHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#1A1F2C] border-gray-700">
              <DropdownMenuItem 
                onClick={() => setShowReclassify(true)}
                className="text-gray-200"
              >
                Move to...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            onClick={() => onDelete?.(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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