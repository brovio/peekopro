import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface CompletedTasksSectionProps {
  tasks: Array<{
    id: string;
    content: string;
    category: string;
    completed?: boolean;
  }>;
}

const CompletedTasksSection = ({ tasks }: CompletedTasksSectionProps) => {
  if (tasks.length === 0) return null;

  return (
    <Card className="p-6 mt-6 bg-[#1A1F2C] border-2 border-green-600">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle2 className="w-6 h-6 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-100">Completed Tasks</h2>
      </div>
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="p-3 bg-[#2A2F3C] rounded-md text-gray-200 opacity-75">
            <span>{task.content}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CompletedTasksSection;