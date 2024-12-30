import { Task } from "@/types/task";
import TaskGridLayout from "./TaskGridLayout";

interface FrogTaskGridProps {
  tasks: Task[];
  onBreakdownStart?: (content: string, taskId: string) => void;
}

const FrogTaskGrid = ({ tasks, onBreakdownStart }: FrogTaskGridProps) => {
  const handleRenameCategory = async (oldCategory: string, newCategory: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ category: newCategory })
        .eq('category', oldCategory);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      
      toast({
        title: "Category renamed",
        description: `Successfully renamed category to ${newCategory}`,
      });
    } catch (error: any) {
      toast({
        title: "Error renaming category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMoveTasksToCategory = async (fromCategory: string, toCategory: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ category: toCategory })
        .eq('category', fromCategory);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      
      toast({
        title: "Tasks moved",
        description: `Successfully moved tasks to ${toCategory}`,
      });
    } catch (error: any) {
      toast({
        title: "Error moving tasks",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (category: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('category', category);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      
      toast({
        title: "Category deleted",
        description: "Category and all its tasks have been deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <TaskGridLayout
      tasks={tasks}
      onBreakdownStart={onBreakdownStart}
      onRenameCategory={handleRenameCategory}
      onMoveTasksToCategory={handleMoveTasksToCategory}
      onDeleteCategory={handleDeleteCategory}
    />
  );
};

export default FrogTaskGrid;
