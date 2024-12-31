import { LucideIcon } from "lucide-react";
import TaskCard from "../TaskCard";
import { Task } from "@/types/task";

interface CategoryGridSectionProps {
  categories: string[];
  tasks: Task[];
  onEdit: (taskId: string, newContent: string) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  onBreakdown?: (taskId: string, content: string) => void;
  onRenameCategory?: (category: string, newName: string) => void;
  onMoveTasksToCategory?: (fromCategory: string, toCategory: string) => void;
  onDeleteCategory?: (category: string) => void;
  availableCategories: string[];
  onMoveTask?: (taskId: string, toCategory: string) => void;
  getIcon: (category: string) => LucideIcon;
  getColor: (category: string) => { bg: string; border: string };
}

const CategoryGridSection = ({
  categories,
  tasks,
  onEdit,
  onDelete,
  onComplete,
  onBreakdown,
  onRenameCategory,
  onMoveTasksToCategory,
  onDeleteCategory,
  availableCategories,
  onMoveTask,
  getIcon,
  getColor,
}: CategoryGridSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map(category => {
        const categoryTasks = tasks.filter(task => task.category === category && !task.completed);
        const { bg, border } = getColor(category);
        
        return (
          <TaskCard
            key={category}
            category={category}
            icon={getIcon(category)}
            color={bg}
            borderColor={border}
            tasks={categoryTasks}
            onEdit={onEdit}
            onDelete={onDelete}
            onComplete={onComplete}
            onBreakdown={onBreakdown}
            showBreakdownButton
            onRenameCategory={onRenameCategory}
            onMoveTasksToCategory={onMoveTasksToCategory}
            onDeleteCategory={onDeleteCategory}
            availableCategories={availableCategories}
            onMoveTask={onMoveTask}
          />
        );
      })}
    </div>
  );
};

export default CategoryGridSection;