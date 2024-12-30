import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MoveCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availableCategories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onMove: () => void;
}

const MoveCategoryDialog = ({
  isOpen,
  onOpenChange,
  availableCategories,
  selectedCategory,
  onCategorySelect,
  onMove,
}: MoveCategoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1F2C] border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Move Tasks</DialogTitle>
          <DialogDescription className="text-gray-400">
            Select a category to move all tasks to
          </DialogDescription>
        </DialogHeader>
        <Select value={selectedCategory} onValueChange={onCategorySelect}>
          <SelectTrigger className="bg-[#141e38] border-gray-700 text-gray-100">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1F2C] border-gray-700">
            {availableCategories.map((category) => (
              <SelectItem key={category} value={category} className="text-gray-200">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onMove} disabled={!selectedCategory}>
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveCategoryDialog;