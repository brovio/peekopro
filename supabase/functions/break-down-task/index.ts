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

    if (!content) {
      throw new Error('Task content is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
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
          {
            role: 'system',
            content: `You are a task analysis assistant. Based on the task description, generate 2-4 relevant questions that will help break down the task effectively.
            For technical tasks, ask about technology preferences and constraints.
            For design tasks, ask about style guidelines and requirements.
            For documentation tasks, ask about target audience and format preferences.
            Return ONLY an array of questions, nothing else.`
          },
          {
            role: 'user',
            content: content
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
      .map(q => ({
        text: q.replace(/^\d+\.\s*/, '').trim(),
        type: q.toLowerCase().includes('upload') || 
              q.toLowerCase().includes('reference') || 
              q.toLowerCase().includes('mockup') || 
              q.toLowerCase().includes('design') ? 'file' : 
              q.toLowerCase().includes('prefer') ? 'radio' : 'text',
        options: q.toLowerCase().includes('prefer') ? ['Manual', 'Automated'] : undefined
      }));

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