import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookOpen, Briefcase, Dumbbell, Play } from "lucide-react";
import { useState } from "react";
import TaskActionButtons from "./TaskActionButtons";
import TaskNotes from "./TaskNotes";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  category: string;
  icon: any;
  color: string;
  borderColor: string;
  tasks: Array<{
    id: string;
    content: string;
    category: string;
    completed?: boolean;
    breakdown_comments?: string;
  }>;
  onEdit: (taskId: string, newContent: string) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  onBreakdown?: (taskId: string, content: string) => void;
  showBreakdownButton?: boolean;
}

const TaskCard = ({ 
  category, 
  icon: Icon, 
  color, 
  borderColor, 
  tasks,
  onEdit,
  onDelete,
  onComplete,
  onBreakdown,
  showBreakdownButton
}: TaskCardProps) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleEditTask = (taskId: string, newContent: string) => {
    onEdit(taskId, newContent);
    setEditingTaskId(null);
  };

  return (
    <Card className={cn(
      "p-3 sm:p-6 transition-all duration-300",
      "bg-[#1A1F2C] hover:bg-[#242938]",
      `border-2 ${borderColor}`
    )}>
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color.replace('bg-', 'text-')}`} />
        <h2 className="text-base sm:text-xl font-semibold text-gray-100 truncate sm:text-clip">{category}</h2>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="group relative p-2 sm:p-3 bg-[#2A2F3C] rounded-md text-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                {category === "#1" && showBreakdownButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                    onClick={() => onBreakdown?.(task.id, task.content)}
                  >
                    <Play className="h-3 w-3 sm:h-4 sm:w-4 text-[#9b87f5]" />
                  </Button>
                )}
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    defaultValue={task.content}
                    className="w-full bg-[#1A1F2C] p-1.5 sm:p-2 rounded text-gray-200 text-sm sm:text-base"
                    onBlur={(e) => handleEditTask(task.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditTask(task.id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span className="text-sm sm:text-base truncate">{task.content}</span>
                )}
              </div>
              <div className="flex gap-0.5 sm:gap-1 items-center invisible group-hover:visible flex-shrink-0">
                {task.breakdown_comments && (
                  <TaskNotes taskId={task.id} notes={task.breakdown_comments} />
                )}
                <TaskActionButtons
                  onEdit={() => setEditingTaskId(task.id)}
                  onDelete={() => onDelete(task.id)}
                  onComplete={() => onComplete(task.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TaskCard;