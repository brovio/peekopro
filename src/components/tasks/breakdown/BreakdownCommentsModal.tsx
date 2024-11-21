import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BreakdownCommentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  onComplete: () => void;
}

const BreakdownCommentsModal = ({ open, onOpenChange, taskId, onComplete }: BreakdownCommentsModalProps) => {
  const [comments, setComments] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ breakdown_comments: comments })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Comments saved",
        description: "Your breakdown comments have been saved successfully.",
      });

      onComplete();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error saving comments",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-navy-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Add Breakdown Comments</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your comments about the task breakdown..."
            className="h-32 bg-navy-800 border-gray-700 text-gray-100"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            Save Comments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BreakdownCommentsModal;