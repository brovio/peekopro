import { Button } from "@/components/ui/button";
import { Brain, RefreshCw, Trash2 } from "lucide-react";

interface TaskActionsProps {
  isLoading: boolean;
  onAIBreakdown: () => void;
  onReclassify: () => void;
  onDelete: () => void;
}

const TaskActions = ({ isLoading, onAIBreakdown, onReclassify, onDelete }: TaskActionsProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onAIBreakdown}
        disabled={isLoading}
        title="AI Breakdown"
      >
        {isLoading ? (
          <div className="animate-spin">
            <RefreshCw className="h-4 w-4" />
          </div>
        ) : (
          <Brain className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onReclassify}
        title="Reclassify"
      >
        <RefreshCw className="h-4 w-4" />
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