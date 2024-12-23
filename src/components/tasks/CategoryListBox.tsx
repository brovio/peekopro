import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Task, SubTask } from "@/types/task";
import { 
  FileText, Timer, Users, MessageCircle, Home, User2, 
  Lightbulb, AppWindow, Briefcase, Calendar, RefreshCw, 
  AlertTriangle, CheckCircle2, FolderPlus, Gift, Palmtree 
} from "lucide-react";
import TaskProgress from "./TaskProgress";
import { useToast } from "@/components/ui/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import TaskItem from "./TaskItem";
import WorkDayTaskItem from "./WorkDayTaskItem";
import { Json } from "@/integrations/supabase/types";

export interface CategoryListBoxProps {
  title: string;
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskMove?: (taskId: string, category: string) => void;
}

export const CategoryListBox = ({ title, tasks, onTaskUpdate, onTaskDelete, onTaskMove }: CategoryListBoxProps) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const { toast } = useToast();
  const { categorySettings } = useSettings();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleAddSubtask = async (taskId: string) => {
    if (!user || !onTaskUpdate) return;

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newSubtask: SubTask = {
        id: crypto.randomUUID(),
        content: "New subtask",
        completed: false
      };

      try {
        const updatedSubtasks = [...(task.subtasks || []), newSubtask];
        const { error } = await supabase
          .from('tasks')
          .update({
            subtasks: updatedSubtasks as unknown as Json
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

  const getCategoryIcon = (category: string) => {
    const defaultCategories: { [key: string]: any } = {
      "Work Day": Timer,
      "Delegate": Users,
      "Discuss": MessageCircle,
      "Family": Home,
      "Personal": User2,
      "Ideas": Lightbulb,
      "App Ideas": AppWindow,
      "Project Ideas": Briefcase,
      "Meetings": Calendar,
      "Follow-Up": RefreshCw,
      "Urgent": AlertTriangle,
      "Complete": CheckCircle2,
      "Christmas": Gift,
      "Holiday": Palmtree
    };

    // Return the icon component for default categories
    const IconComponent = defaultCategories[category];
    if (IconComponent) {
      return <IconComponent className="h-4 w-4 text-gray-300" />;
    }

    // For new categories, use FolderPlus icon
    return <FolderPlus className="h-4 w-4 text-gray-300" />;
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
                onDelete={onTaskDelete}
                onMove={onTaskMove}
              />
            ) : (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={onTaskDelete}
                onMove={onTaskMove}
              />
            )
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryListBox;
