import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, RefreshCw, GripVertical } from "lucide-react";
import TaskClassificationButtons from "../TaskClassificationButtons";
import { useState } from "react";

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const [showReclassify, setShowReclassify] = useState(false);
  
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group relative p-2 bg-black/20 rounded-md text-white
        cursor-grab active:cursor-grabbing touch-none ${isDragging ? 'z-50' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div {...listeners} className="touch-none">
            <GripVertical className="h-5 w-5 text-white/50" />
          </div>
          <FileText className="h-4 w-4 text-white/70" />
          <span className="break-words whitespace-normal w-full">{task.content}</span>
        </div>
        <div className="flex gap-0.5 items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-white/70"
            onClick={() => setShowReclassify(true)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 text-white/70"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showReclassify && (
        <TaskClassificationButtons
          taskId={task.id}
          onMove={() => {}}
          onClose={() => setShowReclassify(false)}
        />
      )}
    </div>
  );
};

export default TaskItem;