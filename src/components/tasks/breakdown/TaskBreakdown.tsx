import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import BreakdownCommentsModal from "./BreakdownCommentsModal";
import { useState } from "react";
import { useCompleteTask } from "@/hooks/useCompleteTask";

interface TaskBreakdownProps {
  task: string;
  steps: string[];
  isLoading: boolean;
  taskId?: string;
  onTaskChange: (value: string) => void;
  onDirectTest: () => void;
  onGuidedTest: () => void;
  onComplete: () => void;
}

const TaskBreakdown = ({
  task,
  steps,
  isLoading,
  taskId,
  onTaskChange,
  onDirectTest,
  onGuidedTest,
  onComplete
}: TaskBreakdownProps) => {
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const completeTask = useCompleteTask();

  const handleDone = async () => {
    setShowCommentsModal(true);
  };

  const handleCommentsSubmit = async (comments: string) => {
    if (taskId) {
      try {
        // First save the comments
        const { error: commentsError } = await supabase
          .from('tasks')
          .update({ breakdown_comments: comments })
          .eq('id', taskId);

        if (commentsError) throw commentsError;

        // Then complete the task
        const success = await completeTask(taskId);
        
        if (success) {
          setShowCommentsModal(false);
          onComplete();
        }
      } catch (error: any) {
        console.error('Error saving comments:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Input
          value={task}
          onChange={(e) => onTaskChange(e.target.value)}
          placeholder="Enter a task to break down"
          className="w-full"
        />
        <div className="flex gap-2">
          <Button onClick={onDirectTest} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Direct"}
          </Button>
          <Button onClick={onGuidedTest} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guided"}
          </Button>
        </div>
      </div>

      {steps.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className="p-3 bg-[#1A1F2C] rounded-md text-gray-200"
              >
                {step}
              </div>
            ))}
          </div>
          <Button onClick={handleDone} className="w-full">
            Done
          </Button>
        </div>
      )}

      <BreakdownCommentsModal
        open={showCommentsModal}
        onOpenChange={setShowCommentsModal}
        onSubmit={handleCommentsSubmit}
      />
    </div>
  );
};

export default TaskBreakdown;