import { Button } from "@/components/ui/button";
import { Edit, MoveHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { availableCategories } from "../utils/categoryUtils";

interface TaskActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onMove: (category: string) => void;
  currentCategory?: string;
}

const TaskActionButtons = ({ 
  onEdit, 
  onDelete, 
  onComplete, 
  onMove,
  currentCategory 
}: TaskActionButtonsProps) => {
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
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuItem className="text-gray-200 font-semibold px-2 py-1.5 cursor-default">
          Move to...
        </DropdownMenuItem>
        
        {availableCategories.map(category => (
          category !== currentCategory && (
            <DropdownMenuItem
              key={category}
              onClick={() => onMove(category)}
              className="text-gray-200 pl-4"
            >
              {category}
            </DropdownMenuItem>
          )
        ))}
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
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