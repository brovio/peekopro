import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryHeaderProps {
  title: string;
  taskCount: number;
  icon: any;
  onRename: () => void;
  onDelete: () => void;
  hasItems: boolean;
}

const CategoryHeader = ({
  title,
  taskCount,
  icon: Icon,
  onRename,
  onDelete,
  hasItems
}: CategoryHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-300" />
        <span className="text-lg font-medium text-gray-100">{title}</span>
        <span className="text-gray-400">({taskCount})</span>
      </div>
      {title !== "#1" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4 text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[#1A1F2C] border-gray-700">
            <DropdownMenuItem onClick={onRename} className="text-gray-200">
              <Edit className="mr-2 h-4 w-4" />
              Rename Category
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-gray-200">
              <Trash2 className="mr-2 h-4 w-4" />
              {hasItems ? "Delete All Tasks" : "Delete Category"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default CategoryHeader;