import { supabase } from "@/integrations/supabase/client";
import { Task, SubTask } from "@/types/task";

export async function createUserProfile(userId: string) {
  try {
    // First try to get the existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle instead of single to avoid 406 error

    if (fetchError) throw fetchError;

    // If profile exists, return it
    if (existingProfile) {
      return existingProfile.id;
    }

    // If no profile exists, create one using auth context
    const { data: newProfile, error: createError } = await supabase.auth.getUser();
    
    if (createError) throw createError;
    
    // The trigger will automatically create the profile
    return newProfile.user.id;
  } catch (error: any) {
    console.error('Profile creation error:', error);
    throw new Error('Failed to create or fetch user profile');
  }
}

export async function createTask(content: string, userId: string) {
  try {
    // Ensure profile exists and get the profile ID
    const profileId = await createUserProfile(userId);

    // Create the task
    const { data: newTask, error: insertError } = await supabase
      .from('tasks')
      .insert({
        content,
        category: null,
        confidence: 0,
        subtasks: [],
        user_id: profileId
      })
      .select()
      .single();

    if (insertError) throw insertError;
    if (!newTask) throw new Error('Failed to create task');

    return {
      ...newTask,
      subtasks: newTask.subtasks ? (newTask.subtasks as unknown as SubTask[]) : []
    } as Task;
  } catch (error: any) {
    console.error('Task creation error:', error);
    throw error;
  }
}