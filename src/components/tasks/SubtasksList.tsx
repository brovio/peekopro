import { SubTask } from "@/types/task";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubtasksListProps {
  subtasks: SubTask[];
  onSubtaskComplete?: (subtaskId: string) => void;
}

const SubtasksList = ({ subtasks, onSubtaskComplete }: SubtasksListProps) => {
  return (
    <div className="ml-6 space-y-2">
      {subtasks.map(subtask => (
        <div
          key={subtask.id}
          className="flex items-center justify-between p-2 rounded-md bg-[#1a2747]/50 border border-gray-700"
        >
          <span className="text-sm text-gray-300">{subtask.content}</span>
          {onSubtaskComplete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onSubtaskComplete(subtask.id)}
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubtasksList;