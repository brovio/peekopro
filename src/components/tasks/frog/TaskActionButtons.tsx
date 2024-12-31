import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onMove?: () => void;
}

const TaskActionButtons = ({ onEdit, onDelete, onComplete, onMove }: TaskActionButtonsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-[#1A1F2C] border-gray-700">
        <DropdownMenuItem onClick={onEdit} className="text-gray-200">
          Rename
        </DropdownMenuItem>
        {onMove && (
          <DropdownMenuItem onClick={onMove} className="text-gray-200">
            Move
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onComplete} className="text-gray-200">
          Mark Complete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-gray-200 text-red-400">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskActionButtons;