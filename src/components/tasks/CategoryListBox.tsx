import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { FileText, Timer, Trash2, ArrowRight, User, Check, MoreHorizontal, Users, MessageCircle, Home, User2, Lightbulb, AppWindow, Briefcase } from "lucide-react";

interface CategoryListBoxProps {
  title: string;
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

const CategoryListBox = ({ title, tasks, onTaskUpdate }: CategoryListBoxProps) => {
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
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-white w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
          {getCategoryIcon(title)}
          {title}
          <span className="text-sm text-gray-500">({tasks.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-500 italic">No tasks in this category</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center justify-between p-3 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <button className="opacity-60 hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-900">{task.content}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <User className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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