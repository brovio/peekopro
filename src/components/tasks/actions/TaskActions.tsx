import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Trash2, Wand2 } from "lucide-react";

interface TaskActionsProps {
  isLoading: boolean;
  onAIBreakdown: () => void;
  onReclassify: () => void;
  onDelete: () => void;
}

const TaskActions = ({ isLoading, onAIBreakdown, onReclassify, onDelete }: TaskActionsProps) => {
  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-gray-300 hover:text-gray-100"
        onClick={onAIBreakdown}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-gray-300 hover:text-gray-100"
        onClick={onReclassify}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-gray-300 hover:text-gray-100"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TaskActions;