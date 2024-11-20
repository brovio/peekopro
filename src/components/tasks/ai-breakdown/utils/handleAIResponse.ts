import { Task } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";
import { Json } from "@/integrations/supabase/types";

interface AIStep {
  text: string;
}

export const handleAIResponse = async (
  steps: AIStep[],
  taskId: string,
  queryClient: QueryClient
) => {
  if (!Array.isArray(steps)) {
    throw new Error('Invalid response format from AI service');
  }

  console.log('Raw AI steps:', steps);

  const newSubtasks = steps.map(step => ({
    id: crypto.randomUUID(),
    content: step.text || step,  // Handle both {text: string} and string formats
    completed: false
  }));

  console.log('Mapped subtasks:', newSubtasks);

  const { error: updateError } = await supabase
    .from('tasks')
    .update({
      subtasks: newSubtasks as Json
    })
    .eq('id', taskId);

  if (updateError) throw updateError;

  // Update the cache immediately
  queryClient.setQueryData(['tasks'], (oldData: any) => {
    if (!Array.isArray(oldData)) return oldData;
    return oldData.map((t: Task) =>
      t.id === taskId ? { ...t, subtasks: newSubtasks } : t
    );
  });

  return newSubtasks;
};