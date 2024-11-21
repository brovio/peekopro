import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Briefcase, Dumbbell, BookOpen, FileText, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import TaskCard from "./TaskCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface FrogTaskGridProps {
  tasks: {
    id: string;
    content: string;
    category: string;
    completed?: boolean;
  }[];
}

const FrogTaskGrid = ({ tasks }: FrogTaskGridProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  const categories = {
    "#1": { 
      icon: BookOpen, 
      color: "bg-[#9b87f5]",
      borderColor: "border-[#9b87f5]" 
    },
    "Work": { 
      icon: Briefcase, 
      color: "bg-[#0EA5E9]",
      borderColor: "border-[#0EA5E9]" 
    },
    "Fitness": { 
      icon: Dumbbell, 
      color: "bg-[#F97316]",
      borderColor: "border-[#F97316]" 
    },
    "Habit": { 
      icon: BookOpen, 
      color: "bg-[#D946EF]",
      borderColor: "border-[#D946EF]" 
    },
    "Journal": { 
      icon: FileText, 
      color: "bg-[#8B5CF6]",
      borderColor: "border-[#8B5CF6]" 
    },
    "Complete": {
      icon: CheckCircle2,
      color: "bg-[#10B981]",
      borderColor: "border-[#10B981]"
    }
  };

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

  const getTasksByCategory = (category: string) => 
    tasks.filter(task => task.category === category && !task.completed);

  const completedTasks = tasks.filter(task => task.category === 'Complete' || task.completed);

  return (
    <div className="grid gap-6 animate-fade-in">
      {/* #1 Section - Full width */}
      <TaskCard
        category="#1"
        icon={categories["#1"].icon}
        color={categories["#1"].color}
        borderColor={categories["#1"].borderColor}
        tasks={getTasksByCategory("#1")}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onComplete={handleCompleteTask}
      />

      {/* Work Section - Full width */}
      <TaskCard
        category="Work"
        icon={categories["Work"].icon}
        color={categories["Work"].color}
        borderColor={categories["Work"].borderColor}
        tasks={getTasksByCategory("Work")}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onComplete={handleCompleteTask}
      />

      {/* Fitness, Habit, Journal Grid - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Fitness", "Habit", "Journal"].map(category => (
          <TaskCard
            key={category}
            category={category}
            icon={categories[category as keyof typeof categories].icon}
            color={categories[category as keyof typeof categories].color}
            borderColor={categories[category as keyof typeof categories].borderColor}
            tasks={getTasksByCategory(category)}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onComplete={handleCompleteTask}
          />
        ))}
      </div>

      {/* Complete Section - Collapsible */}
      <Collapsible open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
        <Card className="p-6 bg-[#1A1F2C] border-2 border-[#10B981]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
              <h2 className="text-xl font-semibold text-gray-100">Complete</h2>
              <span className="text-sm text-gray-400">({completedTasks.length})</span>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isCompleteOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            {completedTasks.map(task => (
              <div key={task.id} className="group relative p-3 bg-[#2A2F3C] rounded-md text-gray-200 opacity-75">
                <span>{task.content}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};

export default FrogTaskGrid;
