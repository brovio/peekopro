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
    const { taskContent, answers } = await req.json();
    console.log('Processing task:', taskContent);
    console.log('User answers:', answers);

    if (answers) {
      // Process answers and generate steps
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
              content: `You are a task breakdown assistant. Based on the task and user's answers, break down the task into clear, actionable steps. Include specific technical details from their answers.`
            },
            {
              role: 'user',
              content: `Task: ${taskContent}\nUser answers: ${JSON.stringify(answers)}`
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from OpenAI');
      }

      const data = await response.json();
      const steps = data.choices[0].message.content.split('\n').filter(step => step.trim());

      return new Response(
        JSON.stringify({ steps }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Generate initial questions based on task type
      const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: `You are a task analysis assistant. Based on the task description, determine if it's a design/visual task that would benefit from reference images or mockups.
              If it is, include a question about uploading reference materials.
              Generate 2-4 relevant questions that will help break down the task effectively.
              For technical tasks, ask about technology preferences and constraints.
              For design tasks, ask about style guidelines and requirements.
              For documentation tasks, ask about target audience and format preferences.`
            },
            {
              role: 'user',
              content: taskContent
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to get response from OpenAI');
      }

      const analysisData = await analysisResponse.json();
      const questions = analysisData.choices[0].message.content
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
        JSON.stringify({ questions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
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