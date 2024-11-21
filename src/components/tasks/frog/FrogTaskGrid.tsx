import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Briefcase, Dumbbell, BookOpen, FileText, Play, Edit, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface FrogTaskGridProps {
  tasks: {
    id: string;
    content: string;
    category: string;
  }[];
}

const categories = ["#1", "Work", "Fitness", "Habit", "Journal"];

const FrogTaskGrid = ({ tasks }: FrogTaskGridProps) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const { toast } = useToast();

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

  const handleEdit = (taskId: string, content: string) => {
    setEditingTask(taskId);
    setEditedContent(content);
  };

  const handleSaveEdit = async (taskId: string) => {
    if (!editedContent.trim()) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ content: editedContent })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Task updated",
        description: "The task has been successfully updated",
      });
      
      setEditingTask(null);
      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleMove = async (taskId: string, newCategory: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ category: newCategory })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Task moved",
        description: `Task moved to ${newCategory}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to move task",
        variant: "destructive",
      });
    }
  };

  const getTasksByCategory = (category: string) => 
    tasks.filter(task => task.category === category);

  const renderTaskItem = (task: { id: string; content: string }, category: string) => {
    const isEditing = editingTask === task.id;

    return (
      <div key={task.id} className="p-3 bg-[#2A2F3C] rounded-md text-gray-200 flex items-center justify-between group">
        <div className="flex items-center gap-2 flex-1">
          {category === "#1" && (
            <Play className="h-4 w-4 text-[#9b87f5]" />
          )}
          {isEditing ? (
            <Input
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="flex-1 bg-[#1A1F2C] border-gray-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveEdit(task.id);
                }
              }}
            />
          ) : (
            <span>{task.content}</span>
          )}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSaveEdit(task.id)}
              className="h-8 w-8 p-0"
            >
              <Check className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(task.id, task.content)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Move className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="space-y-1">
                    {Object.keys(categories).map((targetCategory) => (
                      category !== targetCategory && (
                        <Button
                          key={targetCategory}
                          variant="ghost"
                          className="w-full justify-start text-sm"
                          onClick={() => handleMove(task.id, targetCategory)}
                        >
                          Move to {targetCategory}
                        </Button>
                      )
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      </div>
    );
  };

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
          {getTasksByCategory("#1").map(task => renderTaskItem(task, "#1"))}
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
          {getTasksByCategory("Work").map(task => renderTaskItem(task, "Work"))}
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
                {getTasksByCategory(category).map(task => renderTaskItem(task, category))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FrogTaskGrid;