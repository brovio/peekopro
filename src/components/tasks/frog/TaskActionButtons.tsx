import { Button } from "@/components/ui/button";
import { FileText, Trash2, Check, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskActionButtonsProps {
  category: string;
  onRename?: (oldCategory: string, newCategory: string) => void;
  onMove?: (fromCategory: string, toCategory: string) => void;
  onDelete?: (category: string) => void;
  availableCategories?: string[];
}

const TaskActionButtons = ({
  category,
  onRename,
  onMove,
  onDelete,
  availableCategories = [],
}: TaskActionButtonsProps) => {
  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4 text-white/70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {availableCategories
            .filter((cat) => cat !== category)
            .map((targetCategory) => (
              <DropdownMenuItem
                key={targetCategory}
                onClick={() => onMove?.(category, targetCategory)}
              >
                Move to {targetCategory}
              </DropdownMenuItem>
            ))}
          <DropdownMenuItem onClick={() => onDelete?.(category)}>
            Delete Category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskActionButtons;