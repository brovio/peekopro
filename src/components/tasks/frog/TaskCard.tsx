import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Icon } from "lucide-react";
import { useState } from "react";
import TaskCardHeader from "./card/TaskCardHeader";
import TaskCardList from "./card/TaskCardList";
import TaskCardDialogs from "./card/TaskCardDialogs";

interface Task {
  id: string;
  content: string;
  category: string;
  completed?: boolean;
  breakdown_comments?: string | null;
}

interface TaskCardProps {
  category: string;
  icon: typeof Icon;
  color: string;
  borderColor: string;
  tasks: Task[];
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
  icon,
  color,
  borderColor,
  tasks,
  onEdit,
  onDelete,
  onComplete,
  onRenameCategory,
  onMoveTasksToCategory,
  onDeleteCategory,
  availableCategories = [],
  onMoveTask
}: TaskCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(category);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);

  // Update filtered categories whenever availableCategories or category changes
  useState(() => {
    setFilteredCategories(availableCategories.filter(cat => cat !== category));
  }, [availableCategories, category]);

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
  const isDefaultCategory = category === "#1";

  return (
    <Card className={cn(
      "p-3 sm:p-6 transition-all duration-300",
      "bg-[#1A1F2C] hover:bg-[#242938]",
      `border-2 ${borderColor || 'border-gray-700'}`
    )}>
      <TaskCardHeader
        icon={icon}
        iconColorClass={iconColorClass}
        category={category}
        onRename={() => setIsRenaming(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
        isDefaultCategory={isDefaultCategory}
      />

      <TaskCardList
        tasks={tasks}
        category={category}
        onEdit={onEdit}
        onDelete={onDelete}
        onComplete={onComplete}
        onMoveTask={handleMoveTask}
      />

      <TaskCardDialogs
        isRenaming={isRenaming}
        setIsRenaming={setIsRenaming}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        handleRenameCategory={handleRenameCategory}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleDeleteCategory={handleDeleteCategory}
        filteredCategories={filteredCategories}
        hasTasksInCategory={tasks.length > 0}
      />
    </Card>
  );
};

export default TaskCard;