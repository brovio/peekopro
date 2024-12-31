import { cn } from "@/lib/utils";
import { Trophy, FileText, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import TaskCard from "./TaskCard";
import CompletedTasksSection from "./CompletedTasksSection";
import CreateCategoryModal from "../CreateCategoryModal";
import { Button } from "@/components/ui/button";

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
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleCreateCategory = async (name: string, icon: string, color: string) => {
    try {
      const tasksToUpdate = tasks.filter(task => task.category === "Uncategorized");
      
      for (const task of tasksToUpdate) {
        const { error } = await supabase
          .from('tasks')
          .update({ category: name })
          .eq('id', task.id);

        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      
      toast({
        title: "Category created",
        description: `Successfully created category ${name}`,
      });
    } catch (error: any) {
      toast({
        title: "Error creating category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getTasksByCategory = (category: string) => 
    tasks.filter(task => task.category === category && !task.completed);

  const completedTasks = tasks.filter(task => task.category === 'Complete' || task.completed);

  const uniqueCategories = [...new Set(tasks.map(task => task.category))]
    .filter(category => category && !['#1', 'Complete', 'Uncategorized'].includes(category));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "#1":
        return Trophy;
      default:
        return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "#1":
        return "bg-[#9b87f5] border-[#9b87f5]";
      default:
        return "bg-[#6366F1] border-[#6366F1]";
    }
  };

  return (
    <div className="grid gap-6 animate-fade-in">
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
      />

      <Button
        onClick={() => setShowCreateModal(true)}
        className="w-full h-24 border-2 border-dashed border-gray-700 bg-transparent hover:bg-gray-800/50 transition-colors"
      >
        <Plus className="h-6 w-6 text-gray-400" />
      </Button>

      {uniqueCategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {uniqueCategories.map(category => (
            <TaskCard
              key={category}
              category={category}
              icon={getCategoryIcon(category)}
              color={getCategoryColor(category).split(' ')[0]}
              borderColor={getCategoryColor(category).split(' ')[1]}
              tasks={getTasksByCategory(category)}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onComplete={handleCompleteTask}
              onBreakdown={handleBreakdownClick}
              showBreakdownButton
            />
          ))}
        </div>
      )}

      <CompletedTasksSection tasks={completedTasks} />

      <CreateCategoryModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateCategory={handleCreateCategory}
      />
    </div>
  );
};

export default FrogTaskGrid;
