import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { Trash2, ArrowRight, User, Check, ListTree } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MonkeyThoughtsBoxProps {
  tasks: Task[];
  onTaskDelete?: (taskId: string) => void;
  onTaskMove?: (taskId: string, category: string) => void;
}

const MonkeyThoughtsBox = ({ tasks, onTaskDelete, onTaskMove }: MonkeyThoughtsBoxProps) => {
  const { toast } = useToast();

  const handleDelete = (taskId: string) => {
    if (onTaskDelete) {
      onTaskDelete(taskId);
      toast({
        title: "Task deleted",
        description: "Click undo to restore the task",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "Task restored",
              });
            }}
          >
            Undo
          </Button>
        ),
      });
    }
  };

  return (
    <Card className="bg-[#141e38] border-gray-700 w-full mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-100 flex items-center gap-2">
          <ListTree className="h-4 w-4 text-gray-300" />
          Monkey Thoughts
          <span className="text-gray-400">({tasks.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-400 italic">No tasks in this category</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center justify-between p-3 rounded-md bg-[#1a2747] hover:bg-[#1f2f52] border border-gray-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <ListTree className="h-4 w-4 text-gray-300" />
                <span className="text-sm text-gray-100">{task.content}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-[#243156]"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-[#243156]"
                  onClick={() => onTaskMove?.(task.id, "Work Day")}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-[#243156]"
                  onClick={() => onTaskMove?.(task.id, "Delegate")}
                >
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MonkeyThoughtsBox;