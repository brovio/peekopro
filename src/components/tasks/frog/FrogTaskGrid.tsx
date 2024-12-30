import { useToast } from "@/components/ui/use-toast";
import TaskCard from "./TaskCard";
import { Task } from "@/types/task";

interface FrogTaskGridProps {
  tasks: Task[];
  onBreakdownStart: (content: string, taskId: string) => void;
}

const FrogTaskGrid = ({ tasks, onBreakdownStart }: FrogTaskGridProps) => {
  const { toast } = useToast();

  const handleRenameCategory = (category: string) => {
    toast({
      title: "Coming soon",
      description: "Category renaming will be available soon",
    });
  };

  const handleDeleteCategory = (category: string) => {
    toast({
      title: "Coming soon",
      description: "Category deletion will be available soon",
    });
  };

  const handleMoveCategory = (category: string) => {
    toast({
      title: "Coming soon",
      description: "Moving tasks between categories will be available soon",
    });
  };

  const categorizedTasks = tasks.reduce((acc: { [key: string]: Task[] }, task) => {
    const category = task.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(categorizedTasks).map(([category, tasks]) => (
        <TaskCard
          key={category}
          category={category}
          tasks={tasks}
          onBreakdownStart={onBreakdownStart}
          onRenameCategory={handleRenameCategory}
          onDeleteCategory={handleDeleteCategory}
          onMoveCategory={handleMoveCategory}
        />
      ))}
    </div>
  );
};

export default FrogTaskGrid;