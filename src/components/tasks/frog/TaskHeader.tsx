import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskHeaderProps {
  category: string;
  icon: any;
  availableCategories: string[];
  onRename?: (oldCategory: string, newCategory: string) => void;
  onMove?: (fromCategory: string, toCategory: string) => void;
  onDelete?: (category: string) => void;
}

const TaskHeader = ({
  category,
  icon: Icon,
  availableCategories,
  onRename,
  onMove,
  onDelete,
}: TaskHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-white/70" />
        <h3 className="text-lg font-medium text-white">{category}</h3>
      </div>
      
      {category !== "#1" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4 text-white/70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[#1A1F2C] border-gray-700">
            {onRename && (
              <DropdownMenuItem onClick={() => onRename(category, "")} className="text-gray-200">
                <Edit className="mr-2 h-4 w-4" />
                Rename Category
              </DropdownMenuItem>
            )}
            {onMove && (
              <DropdownMenuItem onClick={() => onMove(category, "")} className="text-gray-200">
                <RefreshCw className="mr-2 h-4 w-4" />
                Move All Tasks
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(category)} className="text-gray-200">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Category
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default TaskHeader;