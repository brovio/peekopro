import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookOpen, Briefcase, Dumbbell, Play, MoreVertical, Edit, Trash2, MoveRight } from "lucide-react";
import { useState } from "react";
import TaskActionButtons from "./TaskActionButtons";
import TaskNotes from "./TaskNotes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskCardProps {
  category: string;
  icon: any;
  color: string;
  borderColor: string;
  tasks: Array<{
    id: string;
    content: string;
    category: string;
    completed?: boolean;
    breakdown_comments?: string | null;
  }>;
  onEdit: (taskId: string, newContent: string) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  onBreakdown?: (taskId: string, content: string) => void;
  showBreakdownButton?: boolean;
  onRenameCategory?: (category: string, newName: string) => void;
  onMoveTasksToCategory?: (fromCategory: string, toCategory: string) => void;
  onDeleteCategory?: (category: string) => void;
  availableCategories?: string[];
  onMoveTask?: (taskId: string, toCategory: string) => void;
}

const TaskCard = ({ 
  category, 
  icon: Icon, 
  color, 
  borderColor, 
  tasks,
  onEdit,
  onDelete,
  onComplete,
  onBreakdown,
  showBreakdownButton,
  onRenameCategory,
  onMoveTasksToCategory,
  onDeleteCategory,
  availableCategories = [],
  onMoveTask
}: TaskCardProps) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(category);

  const handleEditTask = (taskId: string, newContent: string) => {
    onEdit(taskId, newContent);
    setEditingTaskId(null);
  };

  const handleDeleteCategory = () => {
    if (selectedCategory) {
      onMoveTasksToCategory?.(category, selectedCategory);
    } else {
      onDeleteCategory?.(category);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleRenameCategory = () => {
    if (newCategoryName && newCategoryName !== category) {
      onRenameCategory?.(category, newCategoryName);
    }
    setIsRenaming(false);
  };

  const handleMoveTask = (taskId: string, toCategory: string) => {
    if (onMoveTask) {
      onMoveTask(taskId, toCategory);
    }
  };

  // Safely handle color class
  const iconColorClass = color?.replace('bg-', 'text-') || 'text-gray-400';

  return (
    <Card className={cn(
      "p-3 sm:p-6 transition-all duration-300",
      "bg-[#1A1F2C] hover:bg-[#242938]",
      `border-2 ${borderColor || 'border-gray-700'}`
    )}>
      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColorClass}`} />
          <h2 className="text-base sm:text-xl font-semibold text-gray-100 truncate sm:text-clip">{category}</h2>
        </div>
        {category !== "#1" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-gray-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#1A1F2C] border-gray-700">
              <DropdownMenuItem onClick={() => setIsRenaming(true)} className="text-gray-200">
                <Edit className="mr-2 h-4 w-4" />
                Rename Category
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-gray-200">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="group relative p-2 sm:p-3 bg-[#2A2F3C] rounded-md text-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                {category === "#1" && showBreakdownButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                    onClick={() => onBreakdown?.(task.id, task.content)}
                  >
                    <Play className="h-3 w-3 sm:h-4 sm:w-4 text-[#9b87f5]" />
                  </Button>
                )}
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    defaultValue={task.content}
                    className="w-full bg-[#1A1F2C] p-1.5 sm:p-2 rounded text-gray-200 text-sm sm:text-base"
                    onBlur={(e) => handleEditTask(task.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditTask(task.id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span className="text-sm sm:text-base break-words whitespace-normal w-full">{task.content}</span>
                )}
              </div>
              <div className="flex-shrink-0">
                {task.breakdown_comments && (
                  <TaskNotes taskId={task.id} notes={task.breakdown_comments} />
                )}
                <TaskActionButtons
                  onEdit={() => setEditingTaskId(task.id)}
                  onDelete={() => onDelete(task.id)}
                  onComplete={() => onComplete(task.id)}
                  onMove={(toCategory) => handleMoveTask(task.id, toCategory)}
                  currentCategory={category}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#1A1F2C] border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Delete Category</DialogTitle>
            <DialogDescription className="text-gray-400">
              {tasks.length > 0 
                ? "Choose a category to move tasks to before deleting, or delete all tasks in this category."
                : "Are you sure you want to delete this empty category?"}
            </DialogDescription>
          </DialogHeader>
          
          {tasks.length > 0 && (
            <div className="space-y-4 py-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full bg-[#2A2F3C] border-gray-700 text-gray-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2F3C] border-gray-700">
                  {availableCategories
                    .filter(cat => cat !== category)
                    .map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-gray-200">
                        {cat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCategory}
              disabled={tasks.length > 0 && !selectedCategory}
            >
              {tasks.length > 0 ? (selectedCategory ? "Move & Delete" : "Delete All") : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Category Dialog */}
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent className="bg-[#1A1F2C] border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Rename Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full bg-[#2A2F3C] border border-gray-700 rounded-md p-2 text-gray-200"
              placeholder="Enter new category name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenaming(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRenameCategory}
              disabled={!newCategoryName || newCategoryName === category}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskCard;