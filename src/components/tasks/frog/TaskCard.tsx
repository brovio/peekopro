import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Edit, Trash2, Brain } from "lucide-react";
import TaskActionButtons from "./TaskActionButtons";
import TaskNotes from "./TaskNotes";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
            <DraggableTask
              key={task.id}
              task={task}
              onBreakdown={onBreakdown}
              onEdit={onEdit}
              onDelete={onDelete}
              showBreakdownButton={showBreakdownButton}
            />
          ))}
        </div>
      </div>
      <TaskNotes category={category} />
    </Card>
  );
};

interface DraggableTaskProps {
  task: {
    id: string;
    content: string;
    category: string;
  };
  onBreakdown?: (content: string, taskId: string) => void;
  onEdit?: (taskId: string, newContent: string) => void;
  onDelete?: (taskId: string) => void;
  showBreakdownButton?: boolean;
}

const DraggableTask = ({
  task,
  onBreakdown,
  onEdit,
  onDelete,
  showBreakdownButton,
}: DraggableTaskProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "flex items-center gap-2 p-2 rounded-md bg-black/20",
        "cursor-grab active:cursor-grabbing touch-none",
        "border border-white/10"
      )}
    >
      <div {...listeners}>
        <GripVertical className="h-5 w-5 text-white/50" />
      </div>
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
          onClick={() => onEdit?.(task.id, task.content)}
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
  );
};

export default TaskCard;