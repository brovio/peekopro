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

    // Create new profile
    const { data: profile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: user.email,
        full_name: user.user_metadata.full_name || null
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Profile insert error:', insertError);
      throw insertError;
    }

    return profile.id;
  } catch (error: any) {
    console.error('Profile creation error:', error);
    throw error;
  }
}

export async function createTask(content: string, userId: string) {
  try {
    // Ensure profile exists first
    await createUserProfile(userId);

    // Create the task
    const { data: newTask, error: taskError } = await supabase
      .from('tasks')
      .insert({
        content,
        user_id: userId,
        category: null,
        confidence: 0,
        subtasks: [] as unknown as Json
      })
      .select()
      .single();

    if (taskError) {
      console.error('Task creation error:', taskError);
      throw taskError;
    }

    return {
      ...newTask,
      subtasks: newTask.subtasks ? (newTask.subtasks as unknown as SubTask[]) : []
    } as Task;
  } catch (error: any) {
    console.error('Task creation error:', error);
    throw error;
  }
}