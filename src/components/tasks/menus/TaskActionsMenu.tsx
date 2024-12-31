import { Button } from "@/components/ui/button";
import { MoveHorizontal, RefreshCw, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskActionsMenuProps {
  onDelete?: () => void;
  onReclassify: () => void;
  onMove: () => void;
}

const TaskActionsMenu = ({ onDelete, onReclassify, onMove }: TaskActionsMenuProps) => {
  return (
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
            onClick={onMove}
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
        onClick={onReclassify}
        title="Reclassify"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      {onDelete && (
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7 text-gray-300 hover:text-gray-100"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TaskActionsMenu;