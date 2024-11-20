import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";
import { FileText, Timer, Users, MessageCircle, Home, User2, Lightbulb, AppWindow, Briefcase, Calendar, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import TaskProgress from "./TaskProgress";
import { useToast } from "@/components/ui/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import TaskItem from "./TaskItem";
import WorkDayTaskItem from "./WorkDayTaskItem";

interface CategoryListBoxProps {
  title: string;
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskMove?: (taskId: string, category: string) => void;
}

const CategoryListBox = ({ title, tasks, onTaskUpdate, onTaskDelete, onTaskMove }: CategoryListBoxProps) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const { toast } = useToast();
  const { categorySettings } = useSettings();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleAddSubtask = async (taskId: string) => {
    if (!user || !onTaskUpdate) return;

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newSubtask = {
        id: crypto.randomUUID(),
        content: "New subtask",
        completed: false
      };

      try {
        const updatedSubtasks = [...(task.subtasks || []), newSubtask];
        const { error } = await supabase
          .from('tasks')
          .update({
            subtasks: updatedSubtasks
          })
          .eq('id', taskId);

        if (error) throw error;

        onTaskUpdate(taskId, {
          subtasks: updatedSubtasks
        });

        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      } catch (error: any) {
        toast({
          title: "Failed to add subtask",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!user || !onTaskDelete) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      onTaskDelete(taskId);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

      toast({
        title: "Task deleted",
        description: "Task has been permanently removed",
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-[#141e38] border-gray-700 w-full mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-100 flex items-center gap-2">
          {getCategoryIcon(title)}
          {title}
          <span className="text-gray-400">({tasks.length})</span>
        </CardTitle>
        {categorySettings[title]?.showProgress && (
          <TaskProgress completed={completedTasks} total={tasks.length} />
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-400 italic">No tasks in this category</div>
        ) : (
          tasks.map((task) => (
            title === "Work Day" ? (
              <WorkDayTaskItem
                key={task.id}
                task={task}
                onAddSubtask={handleAddSubtask}
                onGenerateAISubtasks={(taskId) => onTaskUpdate?.(taskId, { subtasks: task.subtasks })}
                onDelete={handleDelete}
              />
            ) : (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onMove={onTaskMove}
              />
            )
          ))
        )}
      </CardContent>
    </Card>
  );
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Work Day":
      return <Timer className="h-4 w-4 text-gray-300" />;
    case "Delegate":
      return <Users className="h-4 w-4 text-gray-300" />;
    case "Discuss":
      return <MessageCircle className="h-4 w-4 text-gray-300" />;
    case "Family":
      return <Home className="h-4 w-4 text-gray-300" />;
    case "Personal":
      return <User2 className="h-4 w-4 text-gray-300" />;
    case "Ideas":
      return <Lightbulb className="h-4 w-4 text-gray-300" />;
    case "App Ideas":
      return <AppWindow className="h-4 w-4 text-gray-300" />;
    case "Project Ideas":
      return <Briefcase className="h-4 w-4 text-gray-300" />;
    case "Meetings":
      return <Calendar className="h-4 w-4 text-gray-300" />;
    case "Follow-Up":
      return <RefreshCw className="h-4 w-4 text-gray-300" />;
    case "Urgent":
      return <AlertTriangle className="h-4 w-4 text-gray-300" />;
    case "Complete":
      return <CheckCircle2 className="h-4 w-4 text-gray-300" />;
    default:
      return <FileText className="h-4 w-4 text-gray-300" />;
  }
};

export default CategoryListBox;