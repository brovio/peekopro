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
    console.log('Processing content:', content);
    console.log('Previous classifications:', previousClassifications);
    console.log('User feedback:', userFeedback);

    // Create system message with examples and instructions
    const systemMessage = `You are a task classification assistant that learns from user feedback. 
    You must respond with a JSON object containing only two fields:
    - category: one of the following categories (Work Day, Delegate, Discuss, Family, Personal, Ideas, App Ideas, Project Ideas, Meetings, Follow-Up, Urgent)
    - confidence: a number between 0 and 1 representing your confidence in the classification`;

    // Create user message with context
    const userMessage = `Based on these previous task classifications:
${previousClassifications?.map((pc: any) => 
  `"${pc.content}" was classified as "${pc.category}"`
).join('\n') || 'No previous classifications'}

${userFeedback ? `Recent user feedback shows that "${userFeedback.content}" should be "${userFeedback.category}"` : ''}

Please classify this task: "${content}"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    let result;
    try {
      // Try to parse the response as JSON first
      result = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      // If parsing fails, try to extract category and confidence from the text
      const content = data.choices[0].message.content;
      const categoryMatch = content.match(/"category":\s*"([^"]+)"/);
      const confidenceMatch = content.match(/"confidence":\s*([\d.]+)/);
      
      if (categoryMatch && confidenceMatch) {
        result = {
          category: categoryMatch[1],
          confidence: parseFloat(confidenceMatch[1])
        };
      } else {
        throw new Error('Could not parse OpenAI response into valid format');
      }
    }

    // Validate the result
    if (!result.category || typeof result.confidence !== 'number') {
      throw new Error('Invalid response format from OpenAI');
    }

    console.log('Final classification result:', result);

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