import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";
import { SubTask } from "@/types/task";

interface SubtaskItemProps {
  subtask: SubTask;
  index: number;
  onComplete: (id: string, completed: boolean) => void;
}

const SubtaskItem = ({ subtask, index, onComplete }: SubtaskItemProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-300 hover:bg-gray-800/50 p-2 rounded transition-colors">
      <Checkbox
        checked={subtask.completed}
        onCheckedChange={(checked) => onComplete(subtask.id, checked as boolean)}
        className="h-4 w-4"
      />
      <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
        {index + 1}. {subtask.content}
      </span>
      {subtask.completed && (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      )}
    </div>
  );
};

export default SubtaskItem;