import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { GripVertical, Brain, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onBreakdownStart?: (content: string, taskId: string) => void;
}

const TaskItem = ({ task, onBreakdownStart }: TaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task
    }
  });

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
        "flex items-center gap-2 p-2 rounded-md",
        "cursor-grab active:cursor-grabbing touch-none",
        "border border-white/10 bg-black/20",
        isDragging && "opacity-50 ring-2 ring-white"
      )}
    >
      <div {...listeners}>
        <GripVertical className="h-5 w-5 text-white/50" />
      </div>
      <span className="flex-1 text-white">{task.content}</span>
      <div className="flex items-center gap-1">
        {onBreakdownStart && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onBreakdownStart(task.content, task.id)}
          >
            <Brain className="h-4 w-4 text-white/70" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskItem;