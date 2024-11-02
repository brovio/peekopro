import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { FileText, Timer, Trash2, ArrowRight, User, Check, Calendar, RefreshCw, AlertTriangle, Users, MessageCircle, Home, User2, Lightbulb, AppWindow, Briefcase, CheckCircle2, Plus, Zap, Clock } from "lucide-react";
import TaskProgress from "./TaskProgress";
import { useToast } from "@/components/ui/use-toast";
import { useSettings } from "@/contexts/SettingsContext";

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

  const handleAddSubtask = (taskId: string) => {
    if (onTaskUpdate) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const newSubtask = {
          id: crypto.randomUUID(),
          content: "New subtask",
          completed: false
        };
        onTaskUpdate(taskId, {
          subtasks: [...(task.subtasks || []), newSubtask]
        });
      }
    }
  };

  const handleGenerateAISubtasks = async (taskId: string) => {
    // Mock AI generation for now
    const mockSubtasks = [
      { id: crypto.randomUUID(), content: "Research phase", completed: false },
      { id: crypto.randomUUID(), content: "Implementation", completed: false },
      { id: crypto.randomUUID(), content: "Testing", completed: false }
    ];
    
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { subtasks: mockSubtasks });
      toast({
        title: "AI Subtasks Generated",
        description: "Added 3 suggested subtasks to your task"
      });
    }
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

  const renderWorkDayTask = (task: Task) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-3 rounded-md bg-[#1a2747] hover:bg-[#1f2f52] border border-gray-700">
        <div className="flex items-center gap-3">
          <button className="opacity-60 hover:opacity-100">
            <Clock className="h-4 w-4 text-gray-300" />
          </button>
          <span className="text-sm text-gray-100">{task.content}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleAddSubtask(task.id)}
            title="Add Subtask"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleGenerateAISubtasks(task.id)}
            title="Generate AI Subtasks"
          >
            <Zap className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="ml-6 space-y-2">
          {task.subtasks.map(subtask => (
            <div
              key={subtask.id}
              className="flex items-center justify-between p-2 rounded-md bg-[#1a2747]/50 border border-gray-700"
            >
              <span className="text-sm text-gray-300">{subtask.content}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {/* Handle subtask completion */}}
              >
                <Check className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
              renderWorkDayTask(task)
            ) : (
              <div
                key={task.id}
                className="group flex items-center justify-between p-3 rounded-md bg-[#1a2747] hover:bg-[#1f2f52] border border-gray-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <button className="opacity-60 hover:opacity-100">
                    <FileText className="h-4 w-4 text-gray-300" />
                  </button>
                  <span className="text-sm text-gray-100">{task.content}</span>
                </div>
                <div className="flex items-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-[#243156]"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-[#243156]"
                    onClick={() => onTaskMove?.(task.id, "Discuss")}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-[#243156]"
                    onClick={() => onTaskMove?.(task.id, "Delegate")}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-[#243156]"
                    onClick={() => onTaskMove?.(task.id, "Complete")}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryListBox;
