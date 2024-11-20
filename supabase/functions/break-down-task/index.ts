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
              content: `You are a task breakdown assistant. For the given task, generate 3-5 specific questions that will help gather information needed for breaking it down into detailed subtasks.
              Each question should be one of these types:
              1. Text input for open-ended questions
              2. Yes/No for simple binary choices
              3. Multiple choice with radio buttons for single selection from options
              4. File upload when documents or images are needed
              
              For multiple choice questions, include "Options:" followed by the choices.
              For yes/no questions, phrase them as questions ending with "(Yes/No)".
              For file upload questions, specify what type of file is expected.
              
              Focus on gathering essential information that will help create a more detailed and accurate task breakdown.`
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
        console.error('OpenAI API error (questions):', questionsResponse.statusText);
        throw new Error(`OpenAI API error: ${questionsResponse.statusText}`);
      }

      const questionsData = await questionsResponse.json();
      console.log('Raw questions response:', questionsData);

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

      console.log('Processed questions:', questions);

      return new Response(
        JSON.stringify({ data: questions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate detailed steps based on content and answers
    const systemPrompt = `You are a task breakdown assistant. Break down the given task into clear, specific, and actionable steps.
    Each step should be detailed and practical, focusing on what needs to be done.
    
    Guidelines:
    - Return 5-8 detailed steps
    - Each step should be clear and actionable
    - Include any necessary prerequisites
    - Be specific about tools or resources needed
    - Consider potential challenges or requirements
    - Focus on practical implementation
    
    Format each step as a complete sentence starting with an action verb.`;

    const userPrompt = `Task: ${content}${
      Object.keys(answers).length > 0 
        ? `\n\nAdditional information:\n${Object.entries(answers)
            .map(([_, value]) => `- ${value}`)
            .filter(answer => answer && answer.length > 0)
            .join('\n')}`
        : '\nProvide detailed steps using best practices and common requirements.'
    }`;

    console.log('Sending to OpenAI:', { systemPrompt, userPrompt });

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!stepsResponse.ok) {
      console.error('OpenAI API error (steps):', stepsResponse.statusText);
      throw new Error(`OpenAI API error: ${stepsResponse.statusText}`);
    }

    const stepsData = await stepsResponse.json();
    console.log('Raw steps response:', stepsData);

    const steps = stepsData.choices[0].message.content
      .split('\n')
      .filter(step => step.trim())
      .map(step => ({
        text: step.replace(/^\d+\.\s*/, '').trim()
      }));

    console.log('Processed steps:', steps);

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