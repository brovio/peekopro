import { Task } from "@/types/task";
import TaskCard from "./TaskCard";

interface TaskSectionProps {
  category: string;
  icon: any;
  color: string;
  borderColor: string;
  tasks: Task[];
  onBreakdownStart?: (content: string, taskId: string) => void;
  availableCategories: string[];
  onRenameCategory?: (oldCategory: string, newCategory: string) => void;
  onMoveTasksToCategory?: (fromCategory: string, toCategory: string) => void;
  onDeleteCategory?: (category: string) => void;
}

const TaskSection = ({
  category,
  icon,
  color,
  borderColor,
  tasks,
  onBreakdownStart,
  availableCategories,
  onRenameCategory,
  onMoveTasksToCategory,
  onDeleteCategory,
}: TaskSectionProps) => {
  return (
    <TaskCard
      category={category}
      icon={icon}
      color={color}
      borderColor={borderColor}
      tasks={tasks}
      onBreakdown={onBreakdownStart}
      showBreakdownButton
      onRenameCategory={onRenameCategory}
      onMoveTasksToCategory={onMoveTasksToCategory}
      onDeleteCategory={onDeleteCategory}
      availableCategories={availableCategories}
    />
  );
};

export default TaskSection;