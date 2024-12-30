import { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskItem from "./TaskItem";
import TaskHeader from "./TaskHeader";

interface TaskSectionProps {
  category: string;
  icon: any;
  color: string;
  borderColor: string;
  tasks: Task[];
  onBreakdownStart?: (content: string, taskId: string) => void;
  availableCategories: string[];
  onRenameCategory?: (oldCategory: string, newCategory: string) => void;
  onMoveTasksToCategory?: (fromCategory: string, toCategory: string) => void;
  onDeleteCategory?: (category: string) => void;
}

const TaskSection = ({
  category,
  icon: Icon,
  color,
  borderColor,
  tasks,
  onBreakdownStart,
  availableCategories,
  onRenameCategory,
  onMoveTasksToCategory,
  onDeleteCategory,
}: TaskSectionProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: category,
  });

  return (
    <Card 
      ref={setNodeRef}
      className={`${color} relative overflow-hidden transition-transform ${
        isOver ? 'scale-[1.02] ring-2 ring-white' : ''
      }`}
    >
      <div className="p-4">
        <TaskHeader
          category={category}
          icon={Icon}
          availableCategories={availableCategories}
          onRename={onRenameCategory}
          onMove={onMoveTasksToCategory}
          onDelete={onDeleteCategory}
        />
        
        <SortableContext 
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 mt-4">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onBreakdown={onBreakdownStart}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </Card>
  );
};

export default TaskSection;