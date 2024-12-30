import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/types/task";
import TaskItem from "./TaskItem";
import TaskHeader from "./TaskHeader";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TaskSectionProps {
  category: string;
  icon: LucideIcon;
  tasks: Task[];
  availableCategories: string[];
  onBreakdownStart?: (content: string, taskId: string) => void;
  onRenameCategory?: (oldCategory: string, newCategory: string) => void;
  onMoveTasksToCategory?: (fromCategory: string, toCategory: string) => void;
  onDeleteCategory?: (category: string) => void;
  color?: string;
  borderColor?: string;
}

const TaskSection = ({
  category,
  icon,
  tasks,
  availableCategories,
  onBreakdownStart,
  onRenameCategory,
  onMoveTasksToCategory,
  onDeleteCategory,
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
      className={cn(
        color,
        "relative overflow-hidden transition-all duration-200",
        isOver && "ring-2 ring-white scale-[1.02] bg-opacity-90",
        !isOver && "hover:ring-1 hover:ring-gray-500"
      )}
    >
      <div className="p-4">
        <TaskHeader
          category={category}
          icon={icon}
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
            {tasks.length === 0 ? (
              <div className="text-sm text-gray-400 italic">
                No tasks in this category
              </div>
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