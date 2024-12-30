import { Card } from "@/components/ui/card";
import CategoryHeader from "../CategoryHeader";
import { Timer, Users, MessageCircle, Home, User2, Lightbulb, AppWindow, Briefcase, Calendar, RefreshCw, AlertTriangle } from "lucide-react";

const categoryIcons: { [key: string]: any } = {
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
};

interface TaskCardProps {
  category: string;
  tasks: { id: string; content: string }[];
  onBreakdownStart?: (content: string, taskId: string) => void;
  onRenameCategory?: (category: string) => void;
  onDeleteCategory?: (category: string) => void;
  onMoveCategory?: (category: string) => void;
}

const TaskCard = ({ 
  category, 
  tasks, 
  onBreakdownStart,
  onRenameCategory,
  onDeleteCategory,
  onMoveCategory
}: TaskCardProps) => {
  const Icon = categoryIcons[category] || Timer;

  return (
    <Card className="p-4 bg-[#1A1F2C] border-gray-700">
      <CategoryHeader
        title={category}
        taskCount={tasks.length}
        icon={Icon}
        onRename={() => onRenameCategory?.(category)}
        onDelete={() => onDeleteCategory?.(category)}
        onMove={() => onMoveCategory?.(category)}
        hasItems={tasks.length > 0}
      />
      <div className="mt-4 space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-2 bg-gray-800 rounded-lg text-sm text-gray-100 cursor-pointer hover:bg-gray-700"
            onClick={() => onBreakdownStart?.(task.content, task.id)}
          >
            {task.content}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TaskCard;