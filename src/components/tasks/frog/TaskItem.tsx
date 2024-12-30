import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Trash2, Brain, GripVertical } from "lucide-react";

interface TaskItemProps {
  task: Task;
  onBreakdown?: (content: string, taskId: string) => void;
}

const TaskItem = ({ task, onBreakdown }: TaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center gap-2 p-2 rounded-md bg-black/20 border border-white/10
        cursor-grab active:cursor-grabbing touch-none ${isDragging ? 'z-50' : ''}`}
    >
      <div {...listeners} className="touch-none">
        <GripVertical className="h-5 w-5 text-white/50" />
      </div>
      <span className="flex-1 text-white">{task.content}</span>
      <div className="flex items-center gap-1">
        {onBreakdown && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onBreakdown(task.content, task.id)}
          >
            <Brain className="h-4 w-4 text-white/70" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskItem;