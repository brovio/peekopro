import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MoveTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMove: (category: string) => void;
  currentCategory: string;
  availableCategories: string[];
}

const MoveTaskModal = ({
  open,
  onOpenChange,
  onMove,
  currentCategory,
  availableCategories
}: MoveTaskModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1F2C] border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Move Task</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Select
            onValueChange={(value) => {
              onMove(value);
              onOpenChange(false);
            }}
          >
            <SelectTrigger className="w-full bg-[#2A2F3C] border-gray-700 text-gray-200">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2F3C] border-gray-700">
              {availableCategories
                .filter(category => category !== currentCategory)
                .map((category) => (
                  <SelectItem 
                    key={category} 
                    value={category}
                    className="text-gray-200"
                  >
                    {category}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoveTaskModal;