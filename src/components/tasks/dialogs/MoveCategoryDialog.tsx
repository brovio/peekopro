import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCategoryIcon } from "../utils/categoryIcons";

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
        <div className="grid gap-2">
          {availableCategories.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => onCategorySelect(category)}
                className="justify-start"
              >
                <Icon className="h-4 w-4 mr-2" />
                <span>{category}</span>
              </Button>
            );
          })}
        </div>
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