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
      "p-6 transition-all duration-300",
      "bg-[#1A1F2C] hover:bg-[#242938]",
      `border-2 ${borderColor}`
    )}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        <h2 className="text-xl font-semibold text-gray-100">{category}</h2>
      </div>
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="group relative p-3 bg-[#2A2F3C] rounded-md text-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {category === "#1" && showBreakdownButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onBreakdown?.(task.id, task.content)}
                  >
                    <Play className="h-4 w-4 text-[#9b87f5]" />
                  </Button>
                )}
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    defaultValue={task.content}
                    className="w-full bg-[#1A1F2C] p-2 rounded text-gray-200"
                    onBlur={(e) => handleEditTask(task.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditTask(task.id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span>{task.content}</span>
                )}
              </div>
              <div className="hidden group-hover:flex gap-1 items-center">
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