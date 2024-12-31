import { Button } from "@/components/ui/button";
import { Edit, MoveHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import MoveTaskModal from "./MoveTaskModal";

interface TaskActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onMove: (category: string) => void;
  currentCategory?: string;
  availableCategories?: string[];
}

const TaskActionButtons = ({ 
  onEdit, 
  onDelete, 
  onComplete, 
  onMove,
  currentCategory = "",
  availableCategories = []
}: TaskActionButtonsProps) => {
  const [showMoveModal, setShowMoveModal] = useState(false);

  return (
    <>
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
          
          <DropdownMenuItem 
            onClick={() => setShowMoveModal(true)} 
            className="text-gray-200"
          >
            <MoveHorizontal className="mr-2 h-4 w-4" />
            Move to...
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-gray-700" />
          
          <DropdownMenuItem onClick={onComplete} className="text-gray-200">
            Mark Complete
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onDelete} className="text-gray-200 text-red-400">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MoveTaskModal
        open={showMoveModal}
        onOpenChange={setShowMoveModal}
        onMove={onMove}
        currentCategory={currentCategory}
        availableCategories={availableCategories}
      />
    </>
  );
};

export default TaskActionButtons;