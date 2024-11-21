import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { basePrompt, styles, count } = await req.json()

    const stylePrompt = styles.length > 0 
      ? `Include these styles in the prompts: ${styles.join(', ')}.` 
      : '';

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
            content: `You are an expert at writing prompts for AI image generation. 
            Generate ${count} different, creative and detailed prompts based on the user's initial idea. 
            Each prompt should be unique and incorporate any requested styles.
            Focus on creating prompts that will generate high-quality, visually appealing images.`
          },
          {
            role: 'user',
            content: `Base prompt: "${basePrompt}"
            ${stylePrompt}
            Generate ${count} unique, detailed prompts that will create amazing images.`
          }
        ],
      }),
    })

    const data = await response.json()
    const generatedText = data.choices[0].message.content

    // Split the response into individual prompts
    const prompts = generatedText
      .split(/\d+\.\s+/)
      .filter(Boolean)
      .map(p => p.trim())
      .slice(0, count)

    return new Response(
      JSON.stringify({ prompts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})