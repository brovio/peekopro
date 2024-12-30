import { Card } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/types/task";
import TaskItem from "./TaskItem";
import TaskHeader from "./TaskHeader";

interface TaskSectionProps {
  category: string;
  icon: any;
  tasks: Task[];
  availableCategories: string[];
  onBreakdownStart?: (content: string, taskId: string) => void;
  onRename?: (oldCategory: string, newCategory: string) => void;
  onMove?: (fromCategory: string, toCategory: string) => void;
  onDelete?: (category: string) => void;
  color?: string;
  borderColor?: string;
}

const TaskSection = ({
  category,
  icon,
  tasks,
  availableCategories,
  onBreakdownStart,
  onRename,
  onMove,
  onDelete,
  color = "bg-[#1A1F2C]",
  borderColor = "border-gray-700"
}: TaskSectionProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: category,
    data: {
      type: 'category',
      category
    }
  });

  return (
    <Card 
      ref={setNodeRef}
      className={`${color} relative overflow-hidden transition-all duration-200 ${
        isOver ? 'scale-[1.02] ring-2 ring-white' : ''
      } ${borderColor}`}
    >
      <div className="p-4">
        <TaskHeader
          category={category}
          icon={icon}
          availableCategories={availableCategories}
          onRename={onRename}
          onMove={onMove}
          onDelete={onDelete}
        />
        
        <SortableContext 
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 mt-4">
            {tasks.length === 0 ? (
              <div className="text-sm text-gray-400 italic">No tasks in this category</div>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onBreakdownStart={onBreakdownStart}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </Card>
  );
};

export default TaskSection;