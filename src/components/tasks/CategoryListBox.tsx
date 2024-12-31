import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getCategoryIcon } from "./utils/categoryUtils";
import CategoryHeader from "./CategoryHeader";
import TaskProgress from "./TaskProgress";
import CategoryContent from "./CategoryContent";
import { useState } from "react";
import { handleCategoryOperations } from "./handlers/categoryOperations";

export interface CategoryListBoxProps {
  title: string;
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskMove?: (taskId: string, category: string) => void;
}

export const CategoryListBox = ({ 
  title, 
  tasks, 
  onTaskUpdate, 
  onTaskDelete, 
  onTaskMove 
}: CategoryListBoxProps) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const { toast } = useToast();
  const { categorySettings } = useSettings();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);

  const handleAddSubtask = async (taskId: string) => {
    if (!user || !onTaskUpdate) return;

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newSubtask = {
        id: crypto.randomUUID(),
        content: "New subtask",
        completed: false
      };

      const updatedSubtasks = [...(task.subtasks || []), newSubtask];
      
      // Convert the subtasks array to a JSON-compatible format
      const subtasksJson = JSON.parse(JSON.stringify(updatedSubtasks));
      
      const { error } = await supabase
        .from('tasks')
        .update({
          subtasks: subtasksJson
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
  };

  const {
    handleRename,
    handleDelete,
    handleMove,
    loadAvailableCategories,
    newCategoryName,
    setNewCategoryName,
    selectedCategory,
    setSelectedCategory,
    availableCategories
  } = handleCategoryOperations({
    user,
    title,
    tasks,
    queryClient,
    toast,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsMoveDialogOpen
  });

  const Icon = getCategoryIcon(title);

  return (
    <Card className="bg-[#141e38] border-gray-700 w-full mb-6">
      <CardHeader className="pb-3">
        <CategoryHeader
          title={title}
          taskCount={tasks.length}
          icon={Icon}
          onRename={() => {
            loadAvailableCategories();
            setIsEditDialogOpen(true);
          }}
          onDelete={() => setIsDeleteDialogOpen(true)}
          onMove={() => {
            loadAvailableCategories();
            setIsMoveDialogOpen(true);
          }}
          hasItems={tasks.length > 0}
        />
        {categorySettings[title]?.showProgress && (
          <TaskProgress completed={completedTasks} total={tasks.length} />
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <CategoryContent
          title={title}
          tasks={tasks}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
          onTaskMove={onTaskMove}
          onAddSubtask={handleAddSubtask}
        />
      </CardContent>

      <EditCategoryDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title={title}
        newCategoryName={newCategoryName}
        onNewCategoryNameChange={setNewCategoryName}
        onSave={handleRename}
      />

      <DeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
      />

      <MoveCategoryDialog
        isOpen={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
        availableCategories={availableCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onMove={handleMove}
      />
    </Card>
  );
};

export default CategoryListBox;
