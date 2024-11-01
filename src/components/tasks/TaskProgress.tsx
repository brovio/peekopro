import { Progress } from "@/components/ui/progress";

interface TaskProgressProps {
  completed: number;
  total: number;
}

const TaskProgress = ({ completed, total }: TaskProgressProps) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-500">
        <span>{completed} of {total} completed</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default TaskProgress;