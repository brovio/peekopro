import { useState } from "react";
import { cn } from "@/lib/utils";
import { GripVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CreateCategoryModal from "../CreateCategoryModal";

interface FrogTaskItemProps {
  task: string;
  index: number;
  onCategorySelect: (category: string) => void;
}

const categories = ["#1", "Work", "Fitness", "Habit", "Journal"];

const FrogTaskItem = ({ task, index, onCategorySelect }: FrogTaskItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-3 p-3 rounded-md cursor-grab active:cursor-grabbing",
              "bg-[#2A2F3C] border-b border-gray-700",
              "transition-all duration-200",
              "animate-fade-in"
            )}
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
            <span className="text-gray-200">{task}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 bg-[#2A2F3C] border-gray-700">
          <div className="space-y-1">
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                className="w-full justify-start text-gray-200"
                onClick={() => {
                  onCategorySelect(category);
                  setIsOpen(false);
                }}
              >
                {category}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-200"
              onClick={() => {
                setShowCreateModal(true);
                setIsOpen(false);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <CreateCategoryModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateCategory={onCategorySelect}
      />
    </>
  );
};

export default FrogTaskItem;