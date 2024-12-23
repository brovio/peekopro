import { Card } from "@/components/ui/card";
import { Task } from "@/types/task";
import TaskInput from "./TaskInput";
import UncategorizedTasks from "./UncategorizedTasks";
import FrogTaskGrid from "./FrogTaskGrid";

interface TaskGridContainerProps {
  tasks: Task[];
  onCategorySelect: (taskId: string, category: string) => void;
  onBreakdownStart: (taskContent: string, taskId: string) => void;
}

const TaskGridContainer = ({ tasks, onCategorySelect, onBreakdownStart }: TaskGridContainerProps) => {
  return (
    <Card className="p-3 sm:p-6 bg-[#1A1F2C]">
      <h1 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 text-gray-100 text-center sm:text-left">
        Find The Frog 🐸 Getting Shit Done
      </h1>
      
      <TaskInput onTaskAdded={() => {}} />

      {tasks.length > 0 && (
        <div className="space-y-8 mt-4">
          <UncategorizedTasks
            tasks={tasks}
            onCategorySelect={onCategorySelect}
          />

          <FrogTaskGrid 
            tasks={tasks.filter(task => task.category !== "Uncategorized")}
            onBreakdownStart={onBreakdownStart}
          />
        </div>
      )}
    </Card>
  );
};

export default TaskGridContainer;