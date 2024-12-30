import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/task";
import TaskItem from "../TaskItem";
import WorkDayTaskItem from "../WorkDayTaskItem";
import { GripVertical } from "lucide-react";

interface DraggableTaskProps {
  task: Task;
  category: string;
  onAddSubtask?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onMove?: (taskId: string, category: string) => void;
}

const DraggableTask = ({ task, category, onAddSubtask, onDelete, onMove }: DraggableTaskProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
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
    opacity: isDragging ? 0.5 : 1,
    position: isDragging ? 'relative' : 'static',
    zIndex: isDragging ? 999 : 'auto',
  };

  const dragHandle = (
    <button 
      className="touch-none p-1 cursor-grab active:cursor-grabbing group-hover:opacity-100 opacity-0 transition-all duration-200"
      {...attributes}
      {...listeners}
      aria-label="Drag task"
    >
      <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-200" />
    </button>
  );

  return (
    <div 
      ref={setNodeRef} 
      style={style as React.CSSProperties}
      className="touch-manipulation mb-2"
    >
      {category === "Work Day" ? (
        <WorkDayTaskItem
          task={task}
          onAddSubtask={onAddSubtask}
          onDelete={onDelete}
          onMove={onMove}
          dragHandle={dragHandle}
        />
      ) : (
        <TaskItem
          task={task}
          onDelete={onDelete}
          onMove={onMove}
          dragHandle={dragHandle}
        />
      )}
    </div>
  );
};

export default DraggableTask;