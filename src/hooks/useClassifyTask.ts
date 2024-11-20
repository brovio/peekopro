import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ClassificationResult {
  category: string;
  confidence: number;
}

export const useClassifyTask = () => {
  const fetchPreviousClassifications = async () => {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('content, category')
      .not('category', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return tasks;
  };

  const classifyTask = async (content: string): Promise<ClassificationResult> => {
    try {
      const previousClassifications = await fetchPreviousClassifications();
      
      const { data, error } = await supabase.functions.invoke('classify-task', {
        body: { content, previousClassifications }
      });

      if (error) throw error;

      return {
        category: data.category.toLowerCase(),
        confidence: data.confidence
      };
    } catch (error) {
      console.error('Classification error:', error);
      throw error;
    }
  };

  return {
    classifyTask,
    isClassifying: false
  };
};