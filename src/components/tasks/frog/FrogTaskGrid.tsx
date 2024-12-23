import { cn } from "@/lib/utils";
import { Briefcase, Repeat, BookOpen, Dumbbell, Trophy, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import TaskCard from "./TaskCard";
import CompletedTasksSection from "./CompletedTasksSection";

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
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

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

  const getTasksByCategory = (category: string) => 
    tasks.filter(task => task.category === category && !task.completed);

  const completedTasks = tasks.filter(task => task.category === 'Complete' || task.completed);

  // Get unique categories from tasks, excluding special categories
  const uniqueCategories = [...new Set(tasks.map(task => task.category))]
    .filter(category => category && !['#1', 'Work', 'Fitness', 'Habit', 'Journal', 'Complete', 'Uncategorized'].includes(category));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "#1":
        return Trophy;
      case "Work":
        return Briefcase;
      case "Fitness":
        return Dumbbell;
      case "Habit":
        return Repeat;
      case "Journal":
        return BookOpen;
      default:
        return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "#1":
        return "bg-[#9b87f5] border-[#9b87f5]";
      case "Work":
        return "bg-[#0EA5E9] border-[#0EA5E9]";
      case "Fitness":
      case "Habit":
      case "Journal":
        return "bg-[#F97316] border-[#F97316]";
      default:
        return "bg-[#6366F1] border-[#6366F1]"; // Default color for custom categories
    }
  };

  return (
    <div className="grid gap-6 animate-fade-in">
      {/* #1 Section - Full width */}
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

      {/* Work Section - Full width */}
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
      />

      {/* Fitness, Habit, Journal Grid - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Fitness", "Habit", "Journal"].map(category => (
          <TaskCard
            key={category}
            category={category}
            icon={getCategoryIcon(category)}
            color="bg-[#F97316]"
            borderColor="border-[#F97316]"
            tasks={getTasksByCategory(category)}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onComplete={handleCompleteTask}
            onBreakdown={handleBreakdownClick}
            showBreakdownButton
          />
        ))}
      </div>

      {/* Custom Categories Grid - Responsive */}
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

      {/* Complete Section */}
      <CompletedTasksSection tasks={completedTasks} />
    </div>
  );
};

export default FrogTaskGrid;