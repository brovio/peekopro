import { Task, SubTask } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";

export async function createUserProfile(userId: string) {
  try {
    // First check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // If profile exists, return it
    if (existingProfile) {
      return existingProfile.id;
    }

    // Get the current user's session to ensure we have the right permissions
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session) throw new Error('No active session');

    // If no profile exists, let the database trigger handle the profile creation
    // Just return the user ID since the trigger will create the profile
    return userId;
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