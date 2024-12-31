import { LucideIcon, Trophy, Briefcase, Dumbbell, Repeat, BookOpen, FileText } from "lucide-react";

export const getCategoryIcon = (category: string): LucideIcon => {
  switch (category) {
    case "#1":
      return Trophy;
    case "Work":
      return Briefcase;
    case "Fitness":
      return Dumbbell;
    case "Habit":
      return Repeat;
    case "Journal":
      return BookOpen;
    default:
      return FileText;
  }
};

export const getCategoryColor = (category: string): { bg: string; border: string } => {
  switch (category) {
    case "#1":
      return { bg: "bg-[#9b87f5]", border: "border-[#9b87f5]" };
    case "Work":
      return { bg: "bg-[#0EA5E9]", border: "border-[#0EA5E9]" };
    case "Fitness":
    case "Habit":
    case "Journal":
      return { bg: "bg-[#F97316]", border: "border-[#F97316]" };
    default:
      return { bg: "bg-[#6366F1]", border: "border-[#6366F1]" };
  }
};

export const isDefaultCategory = (category: string): boolean => {
  return ["#1", "Work", "Fitness", "Habit", "Journal", "Complete"].includes(category);
};

interface TaskWithCategory {
  category: string | null;
}

export const getAvailableCategories = async (supabase: any, userId: string): Promise<string[]> => {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('category')
    .eq('user_id', userId)
    .not('category', 'is', null);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  const categories = tasks
    .map((task: TaskWithCategory) => task.category)
    .filter((category: string | null): category is string => 
      category !== null && !isDefaultCategory(category)
    );

  return [...new Set(categories)];
};

export const deleteEmptyCategory = async (supabase: any, userId: string, category: string) => {
  try {
    // First, check if the category is empty
    const { data: tasks, error: checkError } = await supabase
      .from('tasks')
      .select('id')
      .eq('user_id', userId)
      .eq('category', category);

    if (checkError) throw checkError;

    // If there are no tasks, proceed with deletion
    if (tasks.length === 0) {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('user_id', userId)
        .eq('category', category);

      if (deleteError) throw deleteError;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};