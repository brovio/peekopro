import { Button } from "@/components/ui/button";
import { Plus, Zap, Trash2 } from "lucide-react";

interface TaskActionsProps {
  onAddSubtask: () => void;
  onGenerateAI: () => void;
  onDelete: () => void;
}

const TaskActions = ({ onAddSubtask, onGenerateAI, onDelete }: TaskActionsProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onAddSubtask}
        title="Add Subtask"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onGenerateAI}
        title="Generate AI Subtasks"
      >
        <Zap className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TaskActions;