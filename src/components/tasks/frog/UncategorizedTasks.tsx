import { Task } from "@/types/task";
import FrogTaskItem from "./FrogTaskItem";

interface UncategorizedTasksProps {
  tasks: Task[];
  onCategorySelect: (taskId: string, category: string) => void;
}

const UncategorizedTasks = ({ tasks, onCategorySelect }: UncategorizedTasksProps) => {
  const uncategorizedTasks = tasks.filter(task => task.category === "Uncategorized");

  if (uncategorizedTasks.length === 0) return null;

  return (
    <div className="space-y-2">
      {uncategorizedTasks.map((task, index) => (
        <FrogTaskItem
          key={task.id}
          task={task.content}
          index={index}
          onCategorySelect={(category) => onCategorySelect(task.id, category)}
        />
      ))}
    </div>
  );
};

export default UncategorizedTasks;