import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskContent, answers } = await req.json();
    console.log('Processing task:', taskContent);
    console.log('User answers:', answers);

    let systemPrompt = `You are a task breakdown assistant. Analyze the task and either:
1. If you need more information, return 2-3 specific questions in a JSON array.
2. If you have enough information, break down the task into 3-5 logical steps.

Your response must be in this format:
{
  "questions": ["question1", "question2"] // if you need more info
  "steps": ["step1", "step2", "step3"] // if you have enough info
}`;

    if (answers) {
      systemPrompt += "\nUser has provided these answers: " + JSON.stringify(answers);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: taskContent }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    const aiResponse = JSON.parse(data.choices[0].message.content);
    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in break-down-task function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});