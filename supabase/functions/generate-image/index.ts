import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImageRequest {
  prompt: string;
  provider: string;
  model: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, provider, model } = await req.json() as ImageRequest
    let response;
    let cost = 0;

    switch (provider) {
      case 'openai':
        response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024"
          })
        });
        cost = 0.040;
        break;

      case 'fal':
        const falEndpoint = model === 'flux1.1pro' 
          ? 'fal-ai/flux1.1pro'
          : model === 'lcm'
            ? 'fal-ai/lcm'
            : 'fal-ai/fast-sdxl';
            
        response = await fetch(`https://fal.run/${falEndpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${Deno.env.get('FAL_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt })
        });
        cost = model === 'flux1.1pro' ? 0.008 : model === 'lcm' ? 0.003 : 0.005;
        break;

      case 'openrouter':
        response = await fetch('https://openrouter.ai/api/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            prompt,
          })
        });
        cost = model === 'dall-e-3' ? 0.040 : 0.008;
        break;

      default:
        throw new Error('Invalid provider');
    }

    const data = await response.json();
    console.log('Image generation response:', data);

    return new Response(
      JSON.stringify({ 
        ...data,
        cost,
        provider,
        model,
        timestamp: new Date().toISOString()
      }),
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