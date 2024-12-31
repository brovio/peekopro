import { useState } from "react";
import { Task } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { deleteEmptyCategory, getAvailableCategories } from "../utils/categoryUtils";
import { User } from "@supabase/supabase-js";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface CategoryOperationsProps {
  user: User | null;
  title: string;
  tasks: Task[];
  queryClient: QueryClient;
  toast: typeof toast;
  setIsEditDialogOpen: (value: boolean) => void;
  setIsDeleteDialogOpen: (value: boolean) => void;
  setIsMoveDialogOpen: (value: boolean) => void;
}

export const handleCategoryOperations = ({
  user,
  title,
  tasks,
  queryClient,
  toast,
  setIsEditDialogOpen,
  setIsDeleteDialogOpen,
  setIsMoveDialogOpen
}: CategoryOperationsProps) => {
  const [newCategoryName, setNewCategoryName] = useState(title);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const handleRename = async () => {
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
  };

  const handleDelete = async () => {
    if (!user || tasks.length > 0) return;

    try {
      const deleted = await deleteEmptyCategory(supabase, user.id, title);
      
      if (deleted) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        setIsDeleteDialogOpen(false);
        
        toast({
          title: "Category deleted",
          description: "Successfully deleted the category",
        });
      } else {
        toast({
          title: "Cannot delete category",
          description: "Category still contains tasks",
          variant: "destructive",
        });
      }
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
      const { error } = await supabase
        .from('tasks')
        .update({ category: selectedCategory })
        .eq('category', title)
        .eq('user_id', user.id);

      if (error) throw error;

      await deleteEmptyCategory(supabase, user.id, title);

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

  const loadAvailableCategories = async () => {
    if (!user) return;
    const categories = await getAvailableCategories(supabase, user.id);
    setAvailableCategories(categories.filter(cat => cat !== title));
  };

  return {
    handleRename,
    handleDelete,
    handleMove,
    loadAvailableCategories,
    newCategoryName,
    setNewCategoryName,
    selectedCategory,
    setSelectedCategory,
    availableCategories
  };
};