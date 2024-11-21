import { Card } from "@/components/ui/card";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface CompletedTasksSectionProps {
  tasks: Array<{
    id: string;
    content: string;
    category: string;
    completed?: boolean;
  }>;
}

const CompletedTasksSection = ({ tasks }: CompletedTasksSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-[#1A1F2C] border-2 border-[#10B981]">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
            <h2 className="text-xl font-semibold text-gray-100">Complete</h2>
            <span className="text-sm text-gray-400">({tasks.length})</span>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="px-2">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="space-y-2 p-3 pt-0">
            {tasks.map(task => (
              <div key={task.id} className="group relative p-3 bg-[#2A2F3C] rounded-md text-gray-200 opacity-75">
                <span>{task.content}</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CompletedTasksSection;