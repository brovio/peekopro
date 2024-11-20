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
    const { content, previousClassifications, userFeedback } = await req.json();

    // Create a prompt that includes previous classifications and user feedback for learning
    const prompt = `Based on these previous task classifications and user feedback:
${previousClassifications.map((pc: any) => 
  `"${pc.content}" was ${pc.userReclassified ? 'RECLASSIFIED by user' : 'classified'} as "${pc.category}"`
).join('\n')}

${userFeedback ? `Recent user feedback shows that tasks like "${userFeedback.content}" should be classified as "${userFeedback.category}"` : ''}

Please classify this new task: "${content}"

Choose from these categories only:
- Work Day
- Delegate
- Discuss
- Family
- Personal
- Ideas
- App Ideas
- Project Ideas
- Meetings
- Follow-Up
- Urgent

Consider user feedback and reclassifications with higher weight when making your decision.
Respond with only the category name and confidence score in JSON format.`;

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
            content: 'You are a task classification assistant that learns from user feedback. Respond only with JSON containing category and confidence.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in classify-task function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});