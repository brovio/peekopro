import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Task, SubTask } from "@/types/task";
import { 
  FileText, Timer, Users, MessageCircle, Home, User2, 
  Lightbulb, AppWindow, Briefcase, Calendar, RefreshCw, 
  AlertTriangle, CheckCircle2, FolderPlus, Gift, Palmtree,
  Edit, Trash2, Move
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import TaskProgress from "./TaskProgress";
import { useToast } from "@/components/ui/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import TaskItem from "./TaskItem";
import WorkDayTaskItem from "./WorkDayTaskItem";
import { Json } from "@/integrations/supabase/types";
import { useState } from "react";

export interface CategoryListBoxProps {
  title: string;
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskMove?: (taskId: string, category: string) => void;
}

export const CategoryListBox = ({ title, tasks, onTaskUpdate, onTaskDelete, onTaskMove }: CategoryListBoxProps) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const { toast } = useToast();
  const { categorySettings } = useSettings();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(title);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleAddSubtask = async (taskId: string) => {
    if (!user || !onTaskUpdate) return;

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newSubtask: SubTask = {
        id: crypto.randomUUID(),
        content: "New subtask",
        completed: false
      };

      try {
        const updatedSubtasks = [...(task.subtasks || []), newSubtask];
        const { error } = await supabase
          .from('tasks')
          .update({
            subtasks: updatedSubtasks as unknown as Json
          })
          .eq('id', taskId);

        if (error) throw error;

        onTaskUpdate(taskId, {
          subtasks: updatedSubtasks
        });

        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      } catch (error: any) {
        toast({
          title: "Failed to add subtask",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    const defaultCategories: { [key: string]: any } = {
      "Work Day": Timer,
      "Delegate": Users,
      "Discuss": MessageCircle,
      "Family": Home,
      "Personal": User2,
      "Ideas": Lightbulb,
      "App Ideas": AppWindow,
      "Project Ideas": Briefcase,
      "Meetings": Calendar,
      "Follow-Up": RefreshCw,
      "Urgent": AlertTriangle,
      "Complete": CheckCircle2,
      "Christmas": Gift,
      "Holiday": Palmtree
    };

    const IconComponent = defaultCategories[category];
    if (IconComponent) {
      return <IconComponent className="h-4 w-4 text-gray-300" />;
    }

    return <FolderPlus className="h-4 w-4 text-gray-300" />;
  };

  const handleRename = async () => {
    if (!user) return;

    try {
      // Update all tasks in this category to the new category name
      const { error } = await supabase
        .from('tasks')
        .update({ category: newCategoryName })
        .eq('category', title)
        .eq('user_id', user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsEditDialogOpen(false);
      
      toast({
        title: "Category renamed",
        description: `Successfully renamed category to ${newCategoryName}`,
      });
    } catch (error: any) {
      toast({
        title: "Error renaming category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!user || tasks.length > 0) return;

    try {
      // Delete all tasks in this category
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('category', title)
        .eq('user_id', user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Category deleted",
        description: "Successfully deleted the category",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMove = async () => {
    if (!user || !selectedCategory) return;

    try {
      // Move all tasks to the selected category
      const { error } = await supabase
        .from('tasks')
        .update({ category: selectedCategory })
        .eq('category', title)
        .eq('user_id', user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsMoveDialogOpen(false);
      
      toast({
        title: "Tasks moved",
        description: `Successfully moved tasks to ${selectedCategory}`,
      });
    } catch (error: any) {
      toast({
        title: "Error moving tasks",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const availableCategories = [
    "Work Day", "Delegate", "Discuss", "Family", "Personal",
    "Ideas", "App Ideas", "Project Ideas", "Meetings", "Follow-Up",
    "Urgent", "Complete", "Christmas", "Holiday"
  ].filter(cat => cat !== title);

  return (
    <Card className="bg-[#141e38] border-gray-700 w-full mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-100 flex items-center gap-2">
            {getCategoryIcon(title)}
            {title}
            <span className="text-gray-400">({tasks.length})</span>
          </CardTitle>
          {title !== "#1" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4 text-gray-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#1A1F2C] border-gray-700">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="text-gray-200">
                  Rename Category
                </DropdownMenuItem>
                {tasks.length > 0 ? (
                  <DropdownMenuItem onClick={() => setIsMoveDialogOpen(true)} className="text-gray-200">
                    Move Tasks
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-gray-200">
                    Delete Category
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
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
              <WorkDayTaskItem
                key={task.id}
                task={task}
                onAddSubtask={handleAddSubtask}
                onDelete={onTaskDelete}
                onMove={onTaskMove}
              />
            ) : (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={onTaskDelete}
                onMove={onTaskMove}
              />
            )
          ))
        )}
      </CardContent>

      {/* Rename Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#1A1F2C] border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Rename Category</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter a new name for this category
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="bg-[#141e38] border-gray-700 text-gray-100"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#1A1F2C] border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Delete Category</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Dialog */}
      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent className="bg-[#1A1F2C] border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Move Tasks</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select a category to move all tasks to
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {availableCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="justify-start"
              >
                {getCategoryIcon(category)}
                <span className="ml-2">{category}</span>
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMove} disabled={!selectedCategory}>
              Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CategoryListBox;