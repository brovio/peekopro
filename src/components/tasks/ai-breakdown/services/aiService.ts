import { supabase } from "@/integrations/supabase/client";

export const getAIBreakdown = async (content: string, skipQuestions: boolean, answers?: Record<string, string>) => {
  const { data: { data: steps }, error } = await supabase.functions.invoke('break-down-task', {
    body: { 
      content,
      skipQuestions,
      answers
    }
  });

  if (error) throw error;
  return steps;
};