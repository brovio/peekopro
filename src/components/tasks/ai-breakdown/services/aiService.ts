import { supabase } from "@/integrations/supabase/client";

export const getAIBreakdown = async (content: string, skipQuestions: boolean, answers?: Record<string, string>) => {
  console.log('Calling AI breakdown with:', { content, skipQuestions, answers });
  
  const { data: { data: steps }, error } = await supabase.functions.invoke('break-down-task', {
    body: { 
      content,
      skipQuestions,
      answers
    }
  });

  if (error) {
    console.error('AI breakdown error:', error);
    throw error;
  }

  console.log('AI response steps:', steps);
  return steps;
};