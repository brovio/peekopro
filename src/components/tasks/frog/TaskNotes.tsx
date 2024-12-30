import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { useState } from "react";

interface TaskNotesProps {
  taskId?: string;
  notes?: string;
  category: string;
}

const TaskNotes = ({ taskId, notes, category }: TaskNotesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!notes) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setIsOpen(true)}
      >
        <FileText className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-navy-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Notes for {category}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 whitespace-pre-wrap">{notes}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskNotes;