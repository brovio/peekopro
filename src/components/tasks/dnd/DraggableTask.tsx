import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/task";
import TaskItem from "../TaskItem";
import WorkDayTaskItem from "../WorkDayTaskItem";

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

  return (
    <div 
      ref={setNodeRef} 
      {...attributes} 
      {...listeners}
      style={style as React.CSSProperties}
      className="touch-manipulation"
    >
      {category === "Work Day" ? (
        <WorkDayTaskItem
          task={task}
          onAddSubtask={onAddSubtask}
          onDelete={onDelete}
          onMove={onMove}
        />
      ) : (
        <TaskItem
          task={task}
          onDelete={onDelete}
          onMove={onMove}
        />
      )}
    </div>
  );
};

export default DraggableTask;