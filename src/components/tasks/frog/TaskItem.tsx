import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/task";

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
    isDragging
  } = useSortable({
    id: task.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleBreakdown = () => {
    if (onBreakdownStart) {
      onBreakdownStart(task.content, task.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 bg-[#2A2F3C] rounded-lg cursor-move transition-all duration-200 ${
        isDragging ? 'ring-2 ring-white' : ''
      }`}
      onClick={handleBreakdown}
    >
      <p className="text-sm text-gray-200">{task.content}</p>
    </div>
  );
};

export default TaskItem;