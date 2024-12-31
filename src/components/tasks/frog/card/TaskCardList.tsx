import { Button } from "@/components/ui/button";
import TaskActionButtons from "../TaskActionButtons";

interface Task {
  id: string;
  content: string;
  category: string;
  completed?: boolean;
  breakdown_comments?: string | null;
}

interface TaskCardListProps {
  tasks: Task[];
  category: string;
  onEdit: (taskId: string, newContent: string) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  onMoveTask: (taskId: string, toCategory: string) => void;
}

const TaskCardList = ({
  tasks,
  category,
  onEdit,
  onDelete,
  onComplete,
  onMoveTask,
}: TaskCardListProps) => {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      {tasks.map(task => (
        <div key={task.id} className="group relative p-2 sm:p-3 bg-[#2A2F3C] rounded-md text-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
              <span className="text-sm sm:text-base break-words whitespace-normal w-full">
                {task.content}
              </span>
            </div>
            <div className="flex-shrink-0">
              <TaskActionButtons
                onEdit={() => onEdit(task.id, task.content)}
                onDelete={() => onDelete(task.id)}
                onComplete={() => onComplete(task.id)}
                onMove={(toCategory) => onMoveTask(task.id, toCategory)}
                currentCategory={category}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskCardList;