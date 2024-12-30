import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/types/task";
import DraggableTask from "./dnd/DraggableTask";

interface CategoryContentProps {
  tasks: Task[];
  category: string;
}

const CategoryContent = ({ tasks, category }: CategoryContentProps) => {
  return (
    <SortableContext
      items={tasks.map(task => task.id)}
      strategy={verticalListSortingStrategy}
    >
      {tasks.map((task) => (
        <DraggableTask
          key={task.id}
          task={task}
          category={category}
        />
      ))}
    </SortableContext>
  );
};

export default CategoryContent;