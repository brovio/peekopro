import { supabase } from "@/integrations/supabase/client";

export const getAIBreakdown = async (content: string, skipQuestions: boolean, answers?: Record<string, string>) => {
  console.log('Calling AI breakdown with:', { content, skipQuestions, answers });
  
  const { data, error } = await supabase.functions.invoke('break-down-task', {
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

  if (!data?.data) {
    console.error('Invalid response format:', data);
    throw new Error('Invalid response from AI service');
  }

  console.log('AI response steps:', data.data);
  return data.data;
};