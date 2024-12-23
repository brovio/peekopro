import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";
import { FileText, Timer, Users, MessageCircle, Home, User2, Lightbulb, AppWindow, Briefcase, Calendar, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import TaskItem from "../TaskItem";
import WorkDayTaskItem from "../WorkDayTaskItem";

interface TaskCardProps {
  category: string;
  tasks: Task[];
  onBreakdown?: (content: string, taskId: string) => void;
  showBreakdownButton?: boolean;
}

const TaskCard = ({ category, tasks, onBreakdown, showBreakdownButton }: TaskCardProps) => {
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

  return (
    <Card className="bg-[#141e38] border-gray-700 w-full mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-100 flex items-center gap-2">
          {getCategoryIcon(category)}
          {category}
          <span className="text-gray-400">({tasks.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-400 italic">No tasks in this category</div>
        ) : (
          tasks.map((task) => (
            category === "Work Day" ? (
              <WorkDayTaskItem
                key={task.id}
                task={task}
                onAddSubtask={() => {}}
                onDelete={() => {}}
                onMove={() => {}}
              />
            ) : (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={() => {}}
                onMove={() => {}}
              />
            )
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;