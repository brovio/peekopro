import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  newCategoryName: string;
  onNewCategoryNameChange: (value: string) => void;
  onSave: () => void;
}

const EditCategoryDialog = ({
  isOpen,
  onOpenChange,
  title,
  newCategoryName,
  onNewCategoryNameChange,
  onSave,
}: EditCategoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1F2C] border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Rename Category</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter a new name for this category
          </DialogDescription>
        </DialogHeader>
        <Input
          value={newCategoryName}
          onChange={(e) => onNewCategoryNameChange(e.target.value)}
          className="bg-[#141e38] border-gray-700 text-gray-100"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;