import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Briefcase, Dumbbell, BookOpen, FileText, Check, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FrogTaskGridProps {
  tasks: {
    id: string;
    content: string;
    category: string;
  }[];
}

const FrogTaskGrid = ({ tasks }: FrogTaskGridProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

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
    }
  };

  const handleMoveTask = async (taskId: string, newCategory: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ category: newCategory })
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      
      toast({
        title: "Task moved",
        description: `Task moved to ${newCategory}`,
      });
    } catch (error: any) {
      toast({
        title: "Error moving task",
        description: error.message,
        variant: "destructive",
      });
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
      setEditingTaskId(null);
      
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

  const renderTaskItem = (task: { id: string; content: string; category: string }) => {
    const isEditing = editingTaskId === task.id;

    return (
      <div key={task.id} className="group relative p-3 bg-[#2A2F3C] rounded-md text-gray-200">
        {task.category === "#1" && (
          <Play className="inline-block mr-2 h-4 w-4 text-[#9b87f5]" />
        )}
        {isEditing ? (
          <input
            type="text"
            defaultValue={task.content}
            className="w-full bg-[#1A1F2C] p-2 rounded text-gray-200"
            onBlur={(e) => handleEditTask(task.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEditTask(task.id, e.currentTarget.value);
              }
            }}
            autoFocus
          />
        ) : (
          <>
            <span>{task.content}</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setEditingTaskId(task.id)}
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div className="grid gap-1">
                    {Object.keys(categories).map((category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleMoveTask(task.id, category)}
                      >
                        Move to {category}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}
      </div>
    );
  };

  const getTasksByCategory = (category: string) => 
    tasks.filter(task => task.category === category);

  return (
    <div className="grid gap-6 animate-fade-in">
      {/* #1 Section - Full width */}
      <Card className={cn(
        "p-6 transition-all duration-300",
        "bg-[#1A1F2C] hover:bg-[#242938]",
        "border-2 border-[#9b87f5]"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold text-gray-100">#1 Priority</h2>
        </div>
        <div className="space-y-2">
          {getTasksByCategory("#1").map(task => renderTaskItem(task))}
        </div>
      </Card>

      {/* Work Section - Full width */}
      <Card className={cn(
        "p-6 transition-all duration-300",
        "bg-[#1A1F2C] hover:bg-[#242938]",
        "border-2 border-[#0EA5E9]"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="w-6 h-6 text-[#0EA5E9]" />
          <h2 className="text-xl font-semibold text-gray-100">Work</h2>
        </div>
        <div className="space-y-2">
          {getTasksByCategory("Work").map(task => renderTaskItem(task))}
        </div>
      </Card>

      {/* Fitness, Habit, Journal Grid - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Fitness", "Habit", "Journal"].map(category => {
          const categoryConfig = categories[category as keyof typeof categories];
          const Icon = categoryConfig.icon;
          
          return (
            <Card key={category} className={cn(
              "p-6 transition-all duration-300",
              "bg-[#1A1F2C] hover:bg-[#242938]",
              `border-2 ${categoryConfig.borderColor}`
            )}>
              <div className="flex items-center gap-3 mb-4">
                <Icon className={`w-6 h-6 ${categoryConfig.color.replace('bg-', 'text-')}`} />
                <h2 className="text-xl font-semibold text-gray-100">{category}</h2>
              </div>
              <div className="space-y-2">
                {getTasksByCategory(category).map(task => renderTaskItem(task))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FrogTaskGrid;