import { Task, SubTask } from "@/types/task";
import { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";

interface AIStep {
  text: string;
}

export const handleAIResponse = async (
  steps: AIStep[],
  taskId: string,
  queryClient: QueryClient
) => {
  if (!Array.isArray(steps)) {
    console.error('Invalid steps format:', steps);
    throw new Error('Invalid response format from AI service');
  }

  console.log('Processing AI steps:', steps);

  const newSubtasks = steps.map(step => ({
    id: crypto.randomUUID(),
    content: typeof step === 'string' ? step : step.text,
    completed: false
  }));

  console.log('Created subtasks:', newSubtasks);

  const { error: updateError } = await supabase
    .from('tasks')
    .update({
      subtasks: newSubtasks as Json
    })
    .eq('id', taskId);

  if (updateError) {
    console.error('Error updating task with subtasks:', updateError);
    throw updateError;
  }

  // Update the cache immediately
  queryClient.setQueryData(['tasks'], (oldData: any) => {
    if (!Array.isArray(oldData)) return oldData;
    return oldData.map((t: Task) =>
      t.id === taskId ? { ...t, subtasks: newSubtasks } : t
    );
  });

  return newSubtasks;
};