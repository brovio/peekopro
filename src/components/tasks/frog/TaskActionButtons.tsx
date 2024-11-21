import { Button } from "@/components/ui/button";
import { FileText, Trash2, Check } from "lucide-react";

interface TaskActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

const TaskActionButtons = ({ onEdit, onDelete, onComplete }: TaskActionButtonsProps) => {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onEdit}
      >
        <FileText className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onComplete}
      >
        <Check className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TaskActionButtons;