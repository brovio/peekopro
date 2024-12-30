import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookOpen, Briefcase, Dumbbell, Play, MoreVertical } from "lucide-react";
import { useState } from "react";
import TaskActionButtons from "./TaskActionButtons";
import TaskNotes from "./TaskNotes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    breakdown_comments?: string | null;
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

  // Safely handle color class
  const iconColorClass = color?.replace('bg-', 'text-') || 'text-gray-400';

  return (
    <Card className={cn(
      "p-3 sm:p-6 transition-all duration-300",
      "bg-[#1A1F2C] hover:bg-[#242938]",
      `border-2 ${borderColor || 'border-gray-700'}`
    )}>
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColorClass}`} />
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
                  <span className="text-sm sm:text-base break-words whitespace-normal w-full">{task.content}</span>
                )}
              </div>
              <div className="flex-shrink-0">
                {/* Desktop view actions */}
                <div className="hidden sm:flex gap-0.5 items-center invisible group-hover:visible">
                  {task.breakdown_comments && (
                    <TaskNotes taskId={task.id} notes={task.breakdown_comments} />
                  )}
                  <TaskActionButtons
                    onEdit={() => setEditingTaskId(task.id)}
                    onDelete={() => onDelete(task.id)}
                    onComplete={() => onComplete(task.id)}
                  />
                </div>
                {/* Mobile view dropdown */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32 bg-[#2A2F3C] border-gray-700">
                      <DropdownMenuItem onClick={() => setEditingTaskId(task.id)} className="text-gray-200">
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-gray-200">
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onComplete(task.id)} className="text-gray-200">
                        Complete
                      </DropdownMenuItem>
                      {task.breakdown_comments && (
                        <DropdownMenuItem onClick={() => {}} className="text-gray-200">
                          View Notes
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TaskCard;