import { useDroppable } from "@dnd-kit/core";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CategoryHeader from "../CategoryHeader";
import TaskProgress from "../TaskProgress";
import { getCategoryIcon } from "../utils/categoryIcons";

interface DroppableCategoryProps {
  category: string;
  tasks: Task[];
  children: React.ReactNode;
  showProgress?: boolean;
  completedTasks?: number;
  onRename: () => void;
  onDelete: () => void;
}

const DroppableCategory = ({
  category,
  tasks,
  children,
  showProgress,
  completedTasks = 0,
  onRename,
  onDelete,
}: DroppableCategoryProps) => {
  const { setNodeRef } = useDroppable({
    id: category,
  });

  const Icon = getCategoryIcon(category);

  return (
    <Card className="bg-[#141e38] border-gray-700 w-full mb-6" ref={setNodeRef}>
      <CardHeader className="pb-3">
        <CategoryHeader
          title={category}
          taskCount={tasks.length}
          icon={Icon}
          onRename={onRename}
          onDelete={onDelete}
          hasItems={tasks.length > 0}
        />
        {showProgress && (
          <TaskProgress completed={completedTasks} total={tasks.length} />
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-400 italic">No tasks in this category</div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default DroppableCategory;