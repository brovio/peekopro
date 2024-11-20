import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();
    console.log('Processing task content:', content);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a task breakdown assistant. For the given task, generate 3-5 questions that will help gather information needed for breaking it down into subtasks.
            Each question should be one of these types:
            1. Multiple choice (when there are clear options to choose from)
            2. Text input (when detailed explanation is needed)
            3. File upload (when documents, images, or other files are needed)
            
            For multiple choice questions, include "Options:" followed by the choices.
            For file upload questions, specify what type of file is expected.
            
            Example format:
            [What is the preferred technology stack? Options: MERN, LAMP, JAMstack, Other]
            [Please upload any existing design mockups or wireframes (PDF or image files)]
            [Describe the main features you want to include]`
          },
          {
            role: 'user',
            content
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const questions = data.choices[0].message.content
      .split('\n')
      .filter(q => q.trim())
      .map(q => {
        const text = q.replace(/^\d+\.\s*/, '').trim();
        let type = 'text';
        let options;

        if (text.toLowerCase().includes('upload') || 
            text.toLowerCase().includes('attach') ||
            text.toLowerCase().includes('file') ||
            text.toLowerCase().includes('image')) {
          type = 'file';
        } else if (text.toLowerCase().includes('options:')) {
          type = 'radio';
          const optionsMatch = text.match(/options:(.*?)(?:\]|$)/i);
          if (optionsMatch) {
            options = optionsMatch[1]
              .split(',')
              .map(opt => opt.trim())
              .filter(opt => opt.length > 0);
          }
        }

        return { text, type, options };
      });

    console.log('Generated questions:', questions);

    return new Response(
      JSON.stringify({ data: questions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in break-down-task function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});