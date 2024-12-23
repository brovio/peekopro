import { Task } from "@/types/task";
import TaskBreakdown from "../breakdown/TaskBreakdown";

interface TaskBreakdownSectionProps {
  task: string;
  steps: string[];
  isLoading: boolean;
  breakdownTaskId: string | null;
  onTaskChange: (value: string) => void;
  onDirectTest: () => Promise<void>;
  onGuidedTest: () => Promise<void>;
  onComplete: () => Promise<void>;
}

const TaskBreakdownSection = ({
  task,
  steps,
  isLoading,
  breakdownTaskId,
  onTaskChange,
  onDirectTest,
  onGuidedTest,
  onComplete
}: TaskBreakdownSectionProps) => {
  return (
    <TaskBreakdown
      task={task}
      steps={steps}
      isLoading={isLoading}
      taskId={breakdownTaskId || undefined}
      onTaskChange={onTaskChange}
      onDirectTest={onDirectTest}
      onGuidedTest={onGuidedTest}
      onComplete={onComplete}
    />
  );
};

export default TaskBreakdownSection;