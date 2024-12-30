import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { Task } from "@/types/task";
import { Trophy, Briefcase, Dumbbell, Repeat, BookOpen, FileText } from "lucide-react";
import TaskSection from "./TaskSection";
import CompletedTasksSection from "./CompletedTasksSection";

interface TaskGridLayoutProps {
  tasks: Task[];
  onBreakdownStart?: (content: string, taskId: string) => void;
  onRenameCategory?: (oldCategory: string, newCategory: string) => void;
  onMoveTasksToCategory?: (fromCategory: string, toCategory: string) => void;
  onDeleteCategory?: (category: string) => void;
}

const TaskGridLayout = ({
  tasks,
  onBreakdownStart,
  onRenameCategory,
  onMoveTasksToCategory,
  onDeleteCategory,
}: TaskGridLayoutProps) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id.toString();
      const task = tasks.find(t => t.id === taskId);
      const newCategory = over.id.toString();
      
      if (task && onMoveTasksToCategory && task.category !== newCategory) {
        onMoveTasksToCategory(task.category || "", newCategory);
      }
    }
  };

  const getTasksByCategory = (category: string) => 
    tasks.filter(task => task.category === category && !task.completed);

  const completedTasks = tasks.filter(task => task.category === 'Complete' || task.completed);

  // Get unique categories from tasks, excluding special categories
  const uniqueCategories = [...new Set(tasks.map(task => task.category))]
    .filter(category => category && !['#1', 'Work', 'Fitness', 'Habit', 'Journal', 'Complete', 'Uncategorized'].includes(category));

  // Get all unique categories for the select dropdown
  const allCategories = [...new Set(tasks.map(task => task.category))];

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid gap-6 animate-fade-in">
        {/* #1 Section - Full width */}
        <TaskSection
          category="#1"
          icon={Trophy}
          color="bg-[#9b87f5]"
          borderColor="border-[#9b87f5]"
          tasks={getTasksByCategory("#1")}
          onBreakdownStart={onBreakdownStart}
          availableCategories={allCategories}
          onRenameCategory={onRenameCategory}
          onMoveTasksToCategory={onMoveTasksToCategory}
          onDeleteCategory={onDeleteCategory}
        />

        {/* Work Section - Full width */}
        <TaskSection
          category="Work"
          icon={Briefcase}
          color="bg-[#0EA5E9]"
          borderColor="border-[#0EA5E9]"
          tasks={getTasksByCategory("Work")}
          onBreakdownStart={onBreakdownStart}
          availableCategories={allCategories}
          onRenameCategory={onRenameCategory}
          onMoveTasksToCategory={onMoveTasksToCategory}
          onDeleteCategory={onDeleteCategory}
        />

        {/* Fitness, Habit, Journal Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { category: "Fitness", icon: Dumbbell },
            { category: "Habit", icon: Repeat },
            { category: "Journal", icon: BookOpen }
          ].map(({ category, icon }) => (
            <TaskSection
              key={category}
              category={category}
              icon={icon}
              color="bg-[#F97316]"
              borderColor="border-[#F97316]"
              tasks={getTasksByCategory(category)}
              onBreakdownStart={onBreakdownStart}
              availableCategories={allCategories}
              onRenameCategory={onRenameCategory}
              onMoveTasksToCategory={onMoveTasksToCategory}
              onDeleteCategory={onDeleteCategory}
            />
          ))}
        </div>

        {/* Custom Categories Grid - Responsive */}
        {uniqueCategories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {uniqueCategories.map(category => (
              <TaskSection
                key={category}
                category={category}
                icon={FileText}
                color="bg-[#6366F1]"
                borderColor="border-[#6366F1]"
                tasks={getTasksByCategory(category)}
                onBreakdownStart={onBreakdownStart}
                availableCategories={allCategories}
                onRenameCategory={onRenameCategory}
                onMoveTasksToCategory={onMoveTasksToCategory}
                onDeleteCategory={onDeleteCategory}
              />
            ))}
          </div>
        )}

        {/* Complete Section */}
        <CompletedTasksSection tasks={completedTasks} />
      </div>
    </DndContext>
  );
};

export default TaskGridLayout;