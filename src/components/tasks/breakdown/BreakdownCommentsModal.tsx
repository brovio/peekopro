import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface BreakdownCommentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (comments: string) => void;
}

const BreakdownCommentsModal = ({
  open,
  onOpenChange,
  onSubmit,
}: BreakdownCommentsModalProps) => {
  const [comments, setComments] = useState("");

  const handleSubmit = () => {
    onSubmit(comments);
    setComments("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Breakdown Comments</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any comments or notes about this task breakdown..."
            className="min-h-[100px]"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save & Complete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BreakdownCommentsModal;