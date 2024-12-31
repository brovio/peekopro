import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FileText, FolderPlus, BookOpen, List, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCategory: (categoryName: string, icon: string, color: string) => void;
}

const AVAILABLE_ICONS = [
  { icon: FileText, name: 'file-text' },
  { icon: FolderPlus, name: 'folder-plus' },
  { icon: BookOpen, name: 'book-open' },
  { icon: List, name: 'list' },
  { icon: Grid, name: 'grid' },
];

const AVAILABLE_COLORS = [
  { name: 'Purple', value: '#9b87f5' },
  { name: 'Blue', value: '#0EA5E9' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Green', value: '#22C55E' },
];

const CreateCategoryModal = ({ open, onOpenChange, onCreateCategory }: CreateCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0].name);
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onCreateCategory(categoryName.trim(), selectedIcon, selectedColor);
      setCategoryName("");
      setSelectedIcon(AVAILABLE_ICONS[0].name);
      setSelectedColor(AVAILABLE_COLORS[0].value);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1F2C] border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Create New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="categoryName" className="text-gray-200">Category Name</Label>
            <Input
              id="categoryName"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="bg-[#2A2F3C] border-gray-700 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Select Icon</Label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_ICONS.map(({ icon: Icon, name }) => (
                <Button
                  key={name}
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-10 w-10 p-0 border-gray-700",
                    selectedIcon === name && "border-[#9b87f5] bg-[#2A2F3C]"
                  )}
                  onClick={() => setSelectedIcon(name)}
                >
                  <Icon className="h-4 w-4 text-gray-300" />
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Select Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_COLORS.map(({ value }) => (
                <Button
                  key={value}
                  type="button"
                  className={cn(
                    "h-10 w-10 p-0 rounded-full",
                    selectedColor === value ? "ring-2 ring-white" : "ring-1 ring-gray-700"
                  )}
                  style={{ backgroundColor: value }}
                  onClick={() => setSelectedColor(value)}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
              Create Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;