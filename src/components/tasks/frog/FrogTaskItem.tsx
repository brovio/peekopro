import { useState } from "react";
import { cn } from "@/lib/utils";
import { Circle, Square, Diamond, Hexagon, Octagon, Star, Bookmark, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CreateCategoryModal from "../CreateCategoryModal";

interface FrogTaskItemProps {
  task: string;
  index: number;
  onCategorySelect: (category: string) => void;
}

const icons = [
  { Icon: Circle, color: "text-purple-400" },
  { Icon: Square, color: "text-blue-400" },
  { Icon: Diamond, color: "text-pink-400" },
  { Icon: Hexagon, color: "text-green-400" },
  { Icon: Octagon, color: "text-yellow-400" },
  { Icon: Star, color: "text-orange-400" },
  { Icon: Bookmark, color: "text-red-400" },
  { Icon: Check, color: "text-cyan-400" },
];

const categories = ["#1", "Work", "Fitness", "Habit", "Journal"];

const FrogTaskItem = ({ task, index, onCategorySelect }: FrogTaskItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const IconComponent = icons[index % icons.length].Icon;
  
  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-3 p-3 rounded-md cursor-pointer",
              "bg-[#2A2F3C] border-b border-gray-700",
              "transition-all duration-200 hover:bg-[#3A3F4C]",
              "animate-fade-in"
            )}
          >
            <IconComponent 
              className={cn(
                "w-5 h-5",
                icons[index % icons.length].color,
                "transition-all duration-300 hover:scale-110"
              )}
            />
            <span className="text-gray-200">{task}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 bg-[#2A2F3C] border-gray-700">
          <div className="space-y-1">
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                className="w-full justify-start text-gray-200 hover:bg-[#3A3F4C]"
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
              className="w-full justify-start text-gray-200 hover:bg-[#3A3F4C]"
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