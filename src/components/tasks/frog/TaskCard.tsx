import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Edit, Trash2, Brain } from "lucide-react";
import TaskActionButtons from "./TaskActionButtons";
import TaskNotes from "./TaskNotes";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  category: string;
  icon: any;
  color: string;
  borderColor: string;
  tasks: {
    id: string;
    content: string;
    category: string;
    completed?: boolean;
  }[];
  onEdit?: (taskId: string, newContent: string) => void;
  onDelete?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  onBreakdown?: (content: string, taskId: string) => void;
  showBreakdownButton?: boolean;
  onRenameCategory?: (oldCategory: string, newCategory: string) => void;
  onMoveTasksToCategory?: (fromCategory: string, toCategory: string) => void;
  onDeleteCategory?: (category: string) => void;
  availableCategories?: string[];
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
  showBreakdownButton,
  onRenameCategory,
  onMoveTasksToCategory,
  onDeleteCategory,
  availableCategories = [],
}: TaskCardProps) => {
  return (
    <Card className={cn("relative overflow-hidden", color)}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">{category}</h3>
          </div>
          <TaskActionButtons
            category={category}
            onRename={onRenameCategory}
            onMove={onMoveTasksToCategory}
            onDelete={onDeleteCategory}
            availableCategories={availableCategories}
          />
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded-md bg-black/20",
                "cursor-grab active:cursor-grabbing touch-none",
                "border border-white/10"
              )}
            >
              <GripVertical className="h-5 w-5 text-white/50" />
              <span className="flex-1 text-white">{task.content}</span>
              <div className="flex items-center gap-1">
                {showBreakdownButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onBreakdown?.(task.content, task.id)}
                  >
                    <Brain className="h-4 w-4 text-white/70" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onComplete?.(task.id)}
                >
                  <Edit className="h-4 w-4 text-white/70" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onDelete?.(task.id)}
                >
                  <Trash2 className="h-4 w-4 text-white/70" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TaskNotes category={category} />
    </Card>
  );
};

export default TaskCard;