import { Task } from "@/types/task";
import { CategoryListBox } from "@/components/tasks/CategoryListBox";

interface TaskTestListProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskMove: (taskId: string, category: string) => void;
}

const TaskTestList = ({ tasks, onTaskUpdate, onTaskDelete, onTaskMove }: TaskTestListProps) => {
  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category?.toLowerCase() === category.toLowerCase());
  };

  const categories = [
    "Monkey Thoughts",
    "Work Day",
    "Personal",
    "Ideas",
    "App Ideas"
  ];

  return (
    <div className="space-y-6">
      {categories.map(category => (
        <CategoryListBox
          key={category}
          title={category}
          tasks={getTasksByCategory(category)}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
          onTaskMove={onTaskMove}
        />
      ))}
    </div>
  );
};

export default TaskTestList;