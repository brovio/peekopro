import { cn } from "@/lib/utils";
import { Circle, Square, Diamond, Hexagon, Octagon, Star, Bookmark, Check } from "lucide-react";

interface FrogTaskItemProps {
  task: string;
  index: number;
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

const FrogTaskItem = ({ task, index }: FrogTaskItemProps) => {
  const IconComponent = icons[index % icons.length].Icon;
  
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-md",
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
  );
};

export default FrogTaskItem;