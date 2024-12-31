import { Task } from "@/types/task";
import TaskItem from "./TaskItem";
import WorkDayTaskItem from "./WorkDayTaskItem";

interface CategoryContentProps {
  title: string;
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskMove?: (taskId: string, category: string) => void;
  onAddSubtask: (taskId: string) => void;
}

const CategoryContent = ({
  title,
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskMove,
  onAddSubtask
}: CategoryContentProps) => {
  if (tasks.length === 0) {
    return <div className="text-sm text-gray-400 italic">No tasks in this category</div>;
  }

  return (
    <>
      {tasks.map((task) => (
        title === "Work Day" ? (
          <WorkDayTaskItem
            key={task.id}
            task={task}
            onAddSubtask={() => onAddSubtask(task.id)}
            onDelete={onTaskDelete}
            onMove={onTaskMove}
          />
        ) : (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={onTaskDelete}
            onMove={onTaskMove}
          />
        )
      ))}
    </>
  );
};

export default CategoryContent;