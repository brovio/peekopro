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
    const { content, skipQuestions = false, answers = {} } = await req.json();
    console.log('Processing task content:', content);
    console.log('Skip questions:', skipQuestions);
    console.log('User answers:', answers);

    // First, get the questions if needed
    if (!skipQuestions) {
      const questionsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              1. Text input for open-ended questions
              2. Yes/No for simple binary choices
              3. Multiple choice with radio buttons for single selection from options
              4. Checkboxes for multiple selections
              5. File upload when documents or images are needed
              
              For multiple choice or checkbox questions, include "Options:" followed by the choices.
              For yes/no questions, phrase them as questions ending with "(Yes/No)".
              For file upload questions, specify what type of file is expected.`
            },
            {
              role: 'user',
              content
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!questionsResponse.ok) {
        throw new Error(`OpenAI API error: ${questionsResponse.statusText}`);
      }

      const questionsData = await questionsResponse.json();
      const questions = questionsData.choices[0].message.content
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
          } else if (text.toLowerCase().includes('(yes/no)')) {
            type = 'radio';
            options = ['Yes', 'No'];
          } else if (text.toLowerCase().includes('select all that apply')) {
            type = 'checkbox';
            const optionsMatch = text.match(/options:(.*?)(?:\]|$)/i);
            if (optionsMatch) {
              options = optionsMatch[1]
                .split(',')
                .map(opt => opt.trim())
                .filter(opt => opt.length > 0);
            }
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

      return new Response(
        JSON.stringify({ data: questions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format answers for OpenAI
    const formattedAnswers = Object.entries(answers)
      .map(([_, value]) => {
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        return value;
      })
      .filter(answer => answer && answer.length > 0);

    // Generate steps
    const stepsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a task breakdown assistant. Break down the given task into clear, actionable steps. Return 5-8 specific steps. Each step should be concise but detailed enough to be actionable.'
          },
          {
            role: 'user',
            content: `Task: ${content}${
              formattedAnswers.length > 0 
                ? `\n\nAdditional information:\n${formattedAnswers.map(answer => `- ${answer}`).join('\n')}`
                : ''
            }`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!stepsResponse.ok) {
      throw new Error(`OpenAI API error: ${stepsResponse.statusText}`);
    }

    const stepsData = await stepsResponse.json();
    const steps = stepsData.choices[0].message.content
      .split('\n')
      .filter(step => step.trim())
      .map(step => ({
        text: step.replace(/^\d+\.\s*/, '').trim()
      }));

    console.log('Generated steps:', steps);

    return new Response(
      JSON.stringify({ data: steps }),
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