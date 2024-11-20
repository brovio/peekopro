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
            content: 'You are a task classification assistant. Classify the task into one of these categories: Work Day, Delegate, Discuss, Family, Personal, Ideas, App Ideas, Project Ideas, Meetings, Follow-Up, Urgent. Respond with ONLY a JSON object containing "category" (string) and "confidence" (number between 0 and 1).'
          },
          {
            role: 'user',
            content: `Task to classify: "${content}"\n\nPrevious classifications for reference:\n${
              previousClassifications?.map((pc: any) => 
                `"${pc.content}" was classified as "${pc.category}"`
              ).join('\n') || 'No previous classifications'
            }${
              userFeedback ? `\n\nRecent user feedback shows that "${userFeedback.content}" should be "${userFeedback.category}"` : ''
            }`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw OpenAI response:', data);

    let result;
    const aiResponse = data.choices[0].message.content.trim();
    console.log('AI response content:', aiResponse);

    try {
      // First try: direct JSON parse
      result = JSON.parse(aiResponse);
    } catch (e) {
      console.log('Failed to parse response directly, trying to extract from text');
      
      // Second try: extract from text
      const categoryMatch = aiResponse.match(/["']?category["']?\s*:\s*["']([^"']+)["']/i);
      const confidenceMatch = aiResponse.match(/["']?confidence["']?\s*:\s*([\d.]+)/i);
      
      if (categoryMatch && confidenceMatch) {
        result = {
          category: categoryMatch[1],
          confidence: parseFloat(confidenceMatch[1])
        };
      } else {
        console.error('Could not extract valid JSON or category/confidence from response');
        throw new Error('Invalid response format from AI');
      }
    }

    // Validate the result
    if (!result || !result.category || typeof result.confidence !== 'number') {
      console.error('Invalid result structure:', result);
      throw new Error('Invalid response structure from AI');
    }

    // Normalize the category to match expected values
    result.category = result.category.toLowerCase();
    result.confidence = Math.max(0, Math.min(1, result.confidence)); // Ensure confidence is between 0 and 1

    console.log('Final processed result:', result);

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