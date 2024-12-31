import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskCardDialogsProps {
  isRenaming: boolean;
  setIsRenaming: (value: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (value: string) => void;
  handleRenameCategory: () => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (value: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  handleDeleteCategory: () => void;
  filteredCategories: string[];
  hasTasksInCategory: boolean;
}

const TaskCardDialogs = ({
  isRenaming,
  setIsRenaming,
  newCategoryName,
  setNewCategoryName,
  handleRenameCategory,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedCategory,
  setSelectedCategory,
  handleDeleteCategory,
  filteredCategories,
  hasTasksInCategory,
}: TaskCardDialogsProps) => {
  return (
    <>
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent className="bg-[#1A1F2C] border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Rename Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full bg-[#2A2F3C] border border-gray-700 rounded-md p-2 text-gray-200"
              placeholder="Enter new category name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenaming(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRenameCategory}
              disabled={!newCategoryName || newCategoryName === selectedCategory}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#1A1F2C] border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Delete Category</DialogTitle>
          </DialogHeader>
          
          {hasTasksInCategory && (
            <div className="space-y-4 py-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full bg-[#2A2F3C] border-gray-700 text-gray-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2F3C] border-gray-700">
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-gray-200">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCategory}
              disabled={hasTasksInCategory && !selectedCategory}
            >
              {hasTasksInCategory ? (selectedCategory ? "Move & Delete" : "Delete All") : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCardDialogs;