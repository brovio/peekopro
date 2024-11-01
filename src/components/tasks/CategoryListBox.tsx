import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { FileText, Timer, Trash2, ArrowRight, User, Check, Calendar, RefreshCw, AlertTriangle, Users, MessageCircle, Home, User2, Lightbulb, AppWindow, Briefcase, CheckCircle2 } from "lucide-react";
import TaskProgress from "./TaskProgress";
import { useToast } from "@/components/ui/use-toast";

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Work Day":
        return <Timer className="h-4 w-4" />;
      case "Delegate":
        return <Users className="h-4 w-4" />;
      case "Discuss":
        return <MessageCircle className="h-4 w-4" />;
      case "Family":
        return <Home className="h-4 w-4" />;
      case "Personal":
        return <User2 className="h-4 w-4" />;
      case "Ideas":
        return <Lightbulb className="h-4 w-4" />;
      case "App Ideas":
        return <AppWindow className="h-4 w-4" />;
      case "Project Ideas":
        return <Briefcase className="h-4 w-4" />;
      case "Meetings":
        return <Calendar className="h-4 w-4" />;
      case "Follow-Up":
        return <RefreshCw className="h-4 w-4" />;
      case "Urgent":
        return <AlertTriangle className="h-4 w-4" />;
      case "Complete":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleDelete = (taskId: string) => {
    if (onTaskDelete) {
      onTaskDelete(taskId);
      toast({
        title: "Task deleted",
        description: "Click undo to restore the task",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Implement undo functionality here
              toast({
                title: "Task restored",
              });
            }}
          >
            Undo
          </Button>
        ),
      });
    }
  };

  return (
    <Card className="bg-white w-full mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
          {getCategoryIcon(title)}
          {title}
          <span className="text-sm text-gray-500">({tasks.length})</span>
        </CardTitle>
        <TaskProgress completed={completedTasks} total={tasks.length} />
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-500 italic">No tasks in this category</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center justify-between p-3 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <button className="opacity-60 hover:opacity-100">
                  <FileText className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-900">{task.content}</span>
              </div>
              <div className="flex items-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => onTaskMove?.(task.id, "Discuss")}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => onTaskMove?.(task.id, "Delegate")}
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => onTaskMove?.(task.id, "Complete")}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryListBox;
