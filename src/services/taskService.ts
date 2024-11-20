import { Task, SubTask } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export async function createUserProfile(userId: string) {
  try {
    // First check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle() instead of single()

    if (fetchError) throw fetchError;

    // If profile exists, return it
    if (existingProfile) {
      return existingProfile.id;
    }

    // Get the current user's session to ensure we have the right permissions
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session) throw new Error('No active session');

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify the profile was created
    const { data: newProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle() here as well

    if (verifyError) throw verifyError;
    if (!newProfile) throw new Error('Profile creation failed');

    return newProfile.id;
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