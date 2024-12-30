import { DndContext, DragEndEvent, DragOverEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Task } from "@/types/task";
import TaskSection from "./TaskSection";
import { categoryIcons } from "../utils/categoryIcons";
import { useCallback } from "react";

interface TaskGridLayoutProps {
  tasks: Task[];
  onMoveTasksToCategory: (fromCategory: string, toCategory: string) => void;
  onDeleteCategory: (category: string) => void;
  onBreakdownStart?: (content: string, taskId: string) => void;
  onRenameCategory?: (oldName: string, newName: string) => void;
}

const TaskGridLayout = ({ 
  tasks, 
  onMoveTasksToCategory,
  onDeleteCategory,
  onBreakdownStart,
  onRenameCategory
}: TaskGridLayoutProps) => {
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id.toString();
      const task = tasks.find(t => t.id === taskId);
      const newCategory = over.id.toString();
      
      if (task && onMoveTasksToCategory && task.category !== newCategory) {
        onMoveTasksToCategory(task.category || "", newCategory);
      }
    }
  }, [tasks, onMoveTasksToCategory]);

  // Group tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    const category = task.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <DndContext 
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {/* Important Tasks Section */}
        <TaskSection
          category="Important"
          icon={categoryIcons["Important"]}
          tasks={tasksByCategory["Important"] || []}
          color="bg-red-900/20"
          borderColor="border-red-500/20"
          onDeleteCategory={onDeleteCategory}
          onBreakdownStart={onBreakdownStart}
          onRenameCategory={onRenameCategory}
        />

        {/* Urgent Tasks Section */}
        <TaskSection
          category="Urgent"
          icon={categoryIcons["Urgent"]}
          tasks={tasksByCategory["Urgent"] || []}
          color="bg-yellow-900/20"
          borderColor="border-yellow-500/20"
          onDeleteCategory={onDeleteCategory}
          onBreakdownStart={onBreakdownStart}
          onRenameCategory={onRenameCategory}
        />

        {/* Other Categories */}
        {Object.entries(tasksByCategory)
          .filter(([category]) => !["Important", "Urgent", "Uncategorized"].includes(category))
          .map(([category, categoryTasks]) => (
            <TaskSection
              key={category}
              category={category}
              icon={categoryIcons[category] || categoryIcons["Default"]}
              tasks={categoryTasks}
              color="bg-blue-900/20"
              borderColor="border-blue-500/20"
              onDeleteCategory={onDeleteCategory}
              onBreakdownStart={onBreakdownStart}
              onRenameCategory={onRenameCategory}
            />
          ))}

        {/* Uncategorized Tasks Section */}
        {tasksByCategory["Uncategorized"] && tasksByCategory["Uncategorized"].length > 0 && (
          <TaskSection
            key="Uncategorized"
            category="Uncategorized"
            icon={categoryIcons["Uncategorized"]}
            tasks={tasksByCategory["Uncategorized"]}
            color="bg-gray-900/20"
            borderColor="border-gray-500/20"
            onDeleteCategory={onDeleteCategory}
            onBreakdownStart={onBreakdownStart}
            onRenameCategory={onRenameCategory}
          />
        )}
      </div>
    </DndContext>
  );
};

export default TaskGridLayout;
