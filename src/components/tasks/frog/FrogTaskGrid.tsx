import { Task } from "@/types/task";
import { FileText } from "lucide-react";
import TaskCard from "./TaskCard";

interface FrogTaskGridProps {
  tasks: Task[];
  onBreakdownStart?: (content: string, taskId: string) => void;
}

const FrogTaskGrid = ({ tasks, onBreakdownStart }: FrogTaskGridProps) => {
  // Get unique categories from tasks, excluding special categories
  const uniqueCategories = [...new Set(tasks.map(task => task.category))]
    .filter(category => category && !['#1', 'Work', 'Fitness', 'Habit', 'Journal', 'Complete', 'Uncategorized'].includes(category));

  const getTasksByCategory = (category: string) => 
    tasks.filter(task => task.category === category && !task.completed);

  const completedTasks = tasks.filter(task => task.category === 'Complete' || task.completed);

  return (
    <div className="grid gap-6 animate-fade-in">
      {/* #1 Section - Full width */}
      <TaskCard
        category="#1"
        tasks={getTasksByCategory("#1")}
        onBreakdown={onBreakdownStart}
        showBreakdownButton
      />

      {/* Work Section - Full width */}
      <TaskCard
        category="Work"
        tasks={getTasksByCategory("Work")}
        onBreakdown={onBreakdownStart}
        showBreakdownButton
      />

      {/* Fitness, Habit, Journal Grid - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Fitness", "Habit", "Journal"].map(category => (
          <TaskCard
            key={category}
            category={category}
            tasks={getTasksByCategory(category)}
            onBreakdown={onBreakdownStart}
            showBreakdownButton
          />
        ))}
      </div>

      {/* Custom Categories Grid - Responsive */}
      {uniqueCategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {uniqueCategories.map(category => (
            <TaskCard
              key={category}
              category={category}
              tasks={getTasksByCategory(category)}
              onBreakdown={onBreakdownStart}
              showBreakdownButton
            />
          ))}
        </div>
      )}

      {/* Complete Section */}
      {completedTasks.length > 0 && (
        <TaskCard
          category="Complete"
          tasks={completedTasks}
          onBreakdown={onBreakdownStart}
          showBreakdownButton={false}
        />
      )}
    </div>
  );
};

export default FrogTaskGrid;