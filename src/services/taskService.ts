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
      .maybeSingle();

    if (fetchError) throw fetchError;

    // If profile exists, return it
    if (existingProfile) {
      return existingProfile.id;
    }

    // Get user data from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    // Insert the profile manually if it doesn't exist
    const { data: insertedProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: user.email,
        full_name: user.user_metadata.full_name || null
      })
      .select('id')
      .single();

    if (insertError) throw insertError;
    if (!insertedProfile) throw new Error('Failed to create profile');

    return insertedProfile.id;
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