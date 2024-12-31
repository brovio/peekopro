import { Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface TaskCardHeaderProps {
  icon: typeof Icon;
  iconColorClass: string;
  category: string;
  onRename: () => void;
  onDelete: () => void;
  isDefaultCategory: boolean;
}

const TaskCardHeader = ({
  icon: IconComponent,
  iconColorClass,
  category,
  onRename,
  onDelete,
  isDefaultCategory,
}: TaskCardHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-4">
      <div className="flex items-center gap-2">
        <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColorClass}`} />
        <h2 className="text-base sm:text-xl font-semibold text-gray-100 truncate sm:text-clip">
          {category}
        </h2>
      </div>
      {!isDefaultCategory && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4 text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[#1A1F2C] border-gray-700">
            <DropdownMenuItem onClick={onRename} className="text-gray-200">
              Rename Category
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-gray-200">
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default TaskCardHeader;