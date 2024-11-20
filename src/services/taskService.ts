import { supabase } from "@/integrations/supabase/client";
import { Task, SubTask } from "@/types/task";

export async function createUserProfile(userId: string) {
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (!existingProfile) {
    const { error: createError } = await supabase
      .from('profiles')
      .insert({ id: userId });
    
    if (createError) throw createError;
  }

  return userId;
}

export async function createTask(content: string, userId: string) {
  // Ensure profile exists
  const profileId = await createUserProfile(userId);

  // Create the task
  const { error: insertError } = await supabase
    .from('tasks')
    .insert({
      content,
      category: null,
      confidence: 0,
      subtasks: [],
      user_id: profileId
    });

  if (insertError) throw insertError;

  // Fetch the newly created task
  const { data: newTaskData, error: fetchError } = await supabase
    .from('tasks')
    .select('*')
    .eq('content', content)
    .eq('user_id', profileId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (fetchError) throw fetchError;
  if (!newTaskData) throw new Error('Failed to create task');

  return {
    ...newTaskData,
    subtasks: newTaskData.subtasks ? (newTaskData.subtasks as unknown as SubTask[]) : []
  } as Task;
}