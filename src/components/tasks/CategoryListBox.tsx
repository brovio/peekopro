import { DndContext, DragEndEvent, closestCenter, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import EditCategoryDialog from "./dialogs/EditCategoryDialog";
import DeleteCategoryDialog from "./dialogs/DeleteCategoryDialog";
import MoveCategoryDialog from "./dialogs/MoveCategoryDialog";
import { availableCategories } from "./utils/categoryUtils";
import DraggableTask from "./dnd/DraggableTask";
import DroppableCategory from "./dnd/DroppableCategory";
import TaskItem from "./TaskItem";

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
  const [newCategoryName, setNewCategoryName] = useState(title);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newCategory = over.id as string;
      
      if (onTaskMove) {
        onTaskMove(taskId, newCategory);
      }
    }
  };

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <DroppableCategory
        category={title}
        tasks={tasks}
        showProgress={categorySettings[title]?.showProgress}
        completedTasks={completedTasks}
        onRename={() => setIsEditDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
      >
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <DraggableTask
              key={task.id}
              task={task}
              category={title}
              onDelete={onTaskDelete}
              onMove={onTaskMove}
            />
          ))}
        </SortableContext>
      </DroppableCategory>

      <DragOverlay>
        {activeTask ? (
          <div className="w-full max-w-md">
            <TaskItem
              task={activeTask}
              onDelete={onTaskDelete}
              onMove={onTaskMove}
            />
          </div>
        ) : null}
      </DragOverlay>

      <EditCategoryDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title={title}
        newCategoryName={newCategoryName}
        onNewCategoryNameChange={setNewCategoryName}
        onSave={async () => {
          if (!user) return;
          try {
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
        }}
      />

      <DeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={async () => {
          if (!user || tasks.length > 0) return;
          try {
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
        }}
      />

      <MoveCategoryDialog
        isOpen={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
        availableCategories={availableCategories.filter(cat => cat !== title)}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onMove={async () => {
          if (!user || !selectedCategory) return;
          try {
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
        }}
      />
    </DndContext>
  );
};

export default CategoryListBox;