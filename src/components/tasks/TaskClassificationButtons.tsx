import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Timer, Users, MessageCircle, Home, User2, Lightbulb, AppWindow, Briefcase, Calendar, RefreshCw, AlertTriangle } from "lucide-react";

interface TaskClassificationButtonsProps {
  taskId: string;
  onClassify: (taskId: string, category: string) => void;
  onClose?: () => void;  // Added this optional prop
}

const categories = [
  { name: "Work Day", icon: Timer },
  { name: "Delegate", icon: Users },
  { name: "Discuss", icon: MessageCircle },
  { name: "Family", icon: Home },
  { name: "Personal", icon: User2 },
  { name: "Ideas", icon: Lightbulb },
  { name: "App Ideas", icon: AppWindow },
  { name: "Project Ideas", icon: Briefcase },
  { name: "Meetings", icon: Calendar },
  { name: "Follow-Up", icon: RefreshCw },
  { name: "Urgent", icon: AlertTriangle },
];

const TaskClassificationButtons = ({ taskId, onClassify, onClose }: TaskClassificationButtonsProps) => {
  const handleClassify = (category: string) => {
    onClassify(taskId, category);
    onClose?.();  // Call onClose if it exists
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {categories.map(({ name, icon: Icon }) => (
          <Tooltip key={name}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleClassify(name)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default TaskClassificationButtons;