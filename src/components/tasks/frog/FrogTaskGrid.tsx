import { Trophy, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import TaskCard from "./TaskCard";
import CompletedTasksSection from "./CompletedTasksSection";
import CategoryGridSection from "./grid/CategoryGridSection";
import { getCategoryIcon, getCategoryColor } from "../utils/categoryUtils";

interface FrogTaskGridProps {
  tasks: {
    id: string;
    content: string;
    category: string;
    completed?: boolean;
  }[];
  onBreakdownStart?: (content: string, taskId: string) => void;
}

const FrogTaskGrid = ({ tasks, onBreakdownStart }: FrogTaskGridProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleEditTask = async (taskId: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ content: newContent })
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      
      toast({
        title: "Task updated",
        description: "Task content has been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      
      toast({
        title: "Task deleted",
        description: "Task has been removed",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          category: 'Complete',
          completed: true 
        })
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      
      toast({
        title: "Task completed",
        description: "Task has been moved to Complete",
      });
    } catch (error: any) {
      toast({
        title: "Error completing task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBreakdownClick = (taskId: string, content: string) => {
    if (onBreakdownStart) {
      onBreakdownStart(content, taskId);
    }
  };

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

  const handleMoveTask = async (taskId: string, toCategory: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ category: toCategory })
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      
      toast({
        title: "Task moved",
        description: `Task has been moved to ${toCategory}`,
      });
    } catch (error: any) {
      toast({
        title: "Error moving task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getTasksByCategory = (category: string) => 
    tasks.filter(task => task.category === category && !task.completed);

  const completedTasks = tasks.filter(task => task.category === 'Complete' || task.completed);

  // Get unique categories from tasks, excluding special categories
  const uniqueCategories = [...new Set(tasks.map(task => task.category))]
    .filter(category => category && !['#1', 'Work', 'Fitness', 'Habit', 'Journal', 'Complete', 'Uncategorized'].includes(category));

  // Get all unique categories for the select dropdown
  const allCategories = [...new Set(tasks.map(task => task.category))];

  return (
    <div className="grid gap-6 animate-fade-in">
      {/* #1 Section */}
      <TaskCard
        category="#1"
        icon={Trophy}
        color="bg-[#9b87f5]"
        borderColor="border-[#9b87f5]"
        tasks={getTasksByCategory("#1")}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onComplete={handleCompleteTask}
        onBreakdown={handleBreakdownClick}
        showBreakdownButton
        availableCategories={allCategories}
        onMoveTask={handleMoveTask}
      />

      {/* Work Section */}
      <TaskCard
        category="Work"
        icon={Briefcase}
        color="bg-[#0EA5E9]"
        borderColor="border-[#0EA5E9]"
        tasks={getTasksByCategory("Work")}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onComplete={handleCompleteTask}
        onBreakdown={handleBreakdownClick}
        showBreakdownButton
        onRenameCategory={handleRenameCategory}
        onMoveTasksToCategory={handleMoveTasksToCategory}
        onDeleteCategory={handleDeleteCategory}
        availableCategories={allCategories}
        onMoveTask={handleMoveTask}
      />

      {/* Fitness, Habit, Journal Grid */}
      <CategoryGridSection
        categories={["Fitness", "Habit", "Journal"]}
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onComplete={handleCompleteTask}
        onBreakdown={handleBreakdownClick}
        onRenameCategory={handleRenameCategory}
        onMoveTasksToCategory={handleMoveTasksToCategory}
        onDeleteCategory={handleDeleteCategory}
        availableCategories={allCategories}
        onMoveTask={handleMoveTask}
        getIcon={getCategoryIcon}
        getColor={getCategoryColor}
      />

      {/* Custom Categories Grid */}
      {uniqueCategories.length > 0 && (
        <CategoryGridSection
          categories={uniqueCategories}
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onComplete={handleCompleteTask}
          onBreakdown={handleBreakdownClick}
          onRenameCategory={handleRenameCategory}
          onMoveTasksToCategory={handleMoveTasksToCategory}
          onDeleteCategory={handleDeleteCategory}
          availableCategories={allCategories}
          onMoveTask={handleMoveTask}
          getIcon={getCategoryIcon}
          getColor={getCategoryColor}
        />
      )}

      {/* Complete Section */}
      <CompletedTasksSection tasks={completedTasks} />
    </div>
  );
};

export default FrogTaskGrid;