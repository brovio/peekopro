import { cn } from "@/lib/utils";
import { Briefcase, Repeat, BookOpen, Dumbbell, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import TaskCard from "./TaskCard";
import CompletedTasksSection from "./CompletedTasksSection";
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

  return (
    <div className="grid gap-6 animate-fade-in">
      {/* #1 Priority Section - Full width */}
      <TaskCard
        category="#1 Priority"
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
        {["Fitness", "Habit", "Journal"].map(category => {
          let icon;
          switch (category) {
            case "Fitness":
              icon = Dumbbell;
              break;
            case "Habit":
              icon = Repeat;
              break;
            case "Journal":
              icon = BookOpen;
              break;
            default:
              icon = BookOpen;
          }
          
          return (
            <TaskCard
              key={category}
              category={category}
              icon={icon}
              color="bg-[#F97316]"
              borderColor="border-[#F97316]"
              tasks={getTasksByCategory(category)}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onComplete={handleCompleteTask}
              onBreakdown={handleBreakdownClick}
              showBreakdownButton
            />
          );
        })}
      </div>

      {/* Complete Section */}
      <CompletedTasksSection tasks={completedTasks} />
    </div>
  );
};

export default FrogTaskGrid;
