import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Briefcase, Dumbbell, BookOpen, FileText } from "lucide-react";

interface FrogTaskGridProps {
  tasks: {
    id: string;
    content: string;
    category: string;
  }[];
}

const FrogTaskGrid = ({ tasks }: FrogTaskGridProps) => {
  const categories = {
    "#1": { 
      icon: BookOpen, 
      color: "bg-[#9b87f5]",
      borderColor: "border-[#9b87f5]" 
    },
    "Work": { 
      icon: Briefcase, 
      color: "bg-[#0EA5E9]",
      borderColor: "border-[#0EA5E9]" 
    },
    "Fitness": { 
      icon: Dumbbell, 
      color: "bg-[#F97316]",
      borderColor: "border-[#F97316]" 
    },
    "Habit": { 
      icon: BookOpen, 
      color: "bg-[#D946EF]",
      borderColor: "border-[#D946EF]" 
    },
    "Journal": { 
      icon: FileText, 
      color: "bg-[#8B5CF6]",
      borderColor: "border-[#8B5CF6]" 
    }
  };

  const getTasksByCategory = (category: string) => 
    tasks.filter(task => task.category === category);

  return (
    <div className="grid gap-6 animate-fade-in">
      {/* #1 Section - Full width */}
      <Card className={cn(
        "p-6 transition-all duration-300",
        "bg-[#1A1F2C] hover:bg-[#242938]",
        "border-2 border-[#9b87f5]"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold text-gray-100">#1 Priority</h2>
        </div>
        <div className="space-y-2">
          {getTasksByCategory("#1").map(task => (
            <div key={task.id} className="p-3 bg-[#2A2F3C] rounded-md text-gray-200">
              {task.content}
            </div>
          ))}
        </div>
      </Card>

      {/* Work Section - Full width */}
      <Card className={cn(
        "p-6 transition-all duration-300",
        "bg-[#1A1F2C] hover:bg-[#242938]",
        "border-2 border-[#0EA5E9]"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="w-6 h-6 text-[#0EA5E9]" />
          <h2 className="text-xl font-semibold text-gray-100">Work</h2>
        </div>
        <div className="space-y-2">
          {getTasksByCategory("Work").map(task => (
            <div key={task.id} className="p-3 bg-[#2A2F3C] rounded-md text-gray-200">
              {task.content}
            </div>
          ))}
        </div>
      </Card>

      {/* Fitness, Habit, Journal Grid - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Fitness", "Habit", "Journal"].map(category => {
          const categoryConfig = categories[category as keyof typeof categories];
          const Icon = categoryConfig.icon;
          
          return (
            <Card key={category} className={cn(
              "p-6 transition-all duration-300",
              "bg-[#1A1F2C] hover:bg-[#242938]",
              `border-2 ${categoryConfig.borderColor}`
            )}>
              <div className="flex items-center gap-3 mb-4">
                <Icon className={`w-6 h-6 ${categoryConfig.color.replace('bg-', 'text-')}`} />
                <h2 className="text-xl font-semibold text-gray-100">{category}</h2>
              </div>
              <div className="space-y-2">
                {getTasksByCategory(category).map(task => (
                  <div key={task.id} className="p-3 bg-[#2A2F3C] rounded-md text-gray-200">
                    {task.content}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FrogTaskGrid;