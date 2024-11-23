import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a grammar and spelling correction assistant. Your task is to:
1. Fix any spelling mistakes
2. Correct grammar issues
3. Improve sentence structure if needed
4. You may add up to 5 new words (excluding articles and prepositions) if it helps clarify the meaning
5. Maintain the original intent and meaning of the text
6. Do not break down or expand the task, just clean up the language

Example:
Input: "instll notepad++ on my computr"
Output: "Install Notepad++ on my computer"

Input: "setup docker for development enviroment local"
Output: "Set up Docker for local development environment"

Always return just the corrected text, nothing else.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('Improved prompt response:', data);

    return new Response(
      JSON.stringify({ improvedPrompt: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error improving prompt:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});