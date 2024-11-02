import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";
import { FileText, Timer, ArrowRight, User, Check, Clock } from "lucide-react";
import TaskProgress from "./TaskProgress";
import { useToast } from "@/components/ui/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { generateAISubtasks } from "@/utils/generateAISubtasks";
import { getCategoryIcon } from "@/utils/categoryIcons";
import SubtasksList from "./SubtasksList";
import TaskActions from "./TaskActions";
import { Button } from "@/components/ui/button";

interface CategoryListBoxProps {
  title: string;
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskMove?: (taskId: string, category: string) => void;
}

const CategoryListBox = ({ title, tasks, onTaskUpdate, onTaskDelete, onTaskMove }: CategoryListBoxProps) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const { toast } = useToast();
  const { categorySettings } = useSettings();

  const handleAddSubtask = (taskId: string) => {
    if (onTaskUpdate) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const newSubtask = {
          id: crypto.randomUUID(),
          content: "New subtask",
          completed: false
        };
        onTaskUpdate(taskId, {
          subtasks: [...(task.subtasks || []), newSubtask]
        });
      }
    }
  };

  const handleGenerateAISubtasks = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !onTaskUpdate) return;

    const generatedSubtasks = generateAISubtasks(task.content);
    onTaskUpdate(taskId, { subtasks: generatedSubtasks });
    
    toast({
      title: "AI Subtasks Generated",
      description: `Added ${generatedSubtasks.length} suggested subtasks to your task`
    });
  };

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

  const renderWorkDayTask = (task: Task) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-3 rounded-md bg-[#1a2747] hover:bg-[#1f2f52] border border-gray-700">
        <div className="flex items-center gap-3">
          <button className="opacity-60 hover:opacity-100">
            <Clock className="h-4 w-4 text-gray-300" />
          </button>
          <span className="text-sm text-gray-100">{task.content}</span>
        </div>
        <TaskActions
          onAddSubtask={() => handleAddSubtask(task.id)}
          onGenerateAI={() => handleGenerateAISubtasks(task.id)}
          onDelete={() => handleDelete(task.id)}
        />
      </div>
      <SubtasksList
        subtasks={task.subtasks || []}
        onComplete={(subtaskId) => {
          const updatedSubtasks = task.subtasks?.map(st =>
            st.id === subtaskId ? { ...st, completed: true } : st
          );
          onTaskUpdate?.(task.id, { subtasks: updatedSubtasks });
        }}
      />
    </div>
  );

  return (
    <Card className="bg-[#141e38] border-gray-700 w-full mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-100 flex items-center gap-2">
          {getCategoryIcon(title)}
          {title}
          <span className="text-gray-400">({tasks.length})</span>
        </CardTitle>
        {categorySettings[title]?.showProgress && (
          <TaskProgress completed={completedTasks} total={tasks.length} />
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-400 italic">No tasks in this category</div>
        ) : (
          tasks.map((task) => (
            title === "Work Day" ? (
              renderWorkDayTask(task)
            ) : (
              <div
                key={task.id}
                className="group flex items-center justify-between p-3 rounded-md bg-[#1a2747] hover:bg-[#1f2f52] border border-gray-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <button className="opacity-60 hover:opacity-100">
                    <FileText className="h-4 w-4 text-gray-300" />
                  </button>
                  <span className="text-sm text-gray-100">{task.content}</span>
                </div>
                <div className="flex items-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
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
                    onClick={() => onTaskMove?.(task.id, "Discuss")}
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
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-[#243156]"
                    onClick={() => onTaskMove?.(task.id, "Complete")}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryListBox;