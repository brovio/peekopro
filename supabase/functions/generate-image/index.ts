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
    let imageUrl;

    console.log(`Generating image with provider: ${provider}, model: ${model}`);
    console.log(`Prompt: ${prompt}`);

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
        const openaiData = await response.json();
        console.log('OpenAI response:', openaiData);
        
        if (!response.ok) {
          throw new Error(`OpenAI error: ${openaiData.error?.message || 'Unknown error'}`);
        }
        
        imageUrl = openaiData.data?.[0]?.url;
        cost = 0.040;
        break;

      case 'fal':
        let falEndpoint;
        switch (model) {
          case 'flux1.1pro':
            falEndpoint = 'fal-ai/flux';
            break;
          case 'lcm':
            falEndpoint = 'fal-ai/lcm';
            break;
          default:
            falEndpoint = 'fal-ai/fast-sdxl';
        }
        
        response = await fetch(`https://fal.run/v1/${falEndpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${Deno.env.get('FAL_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            height: 1024,
            width: 1024,
            scheduler: "K_EULER",
            num_inference_steps: 50
          })
        });
        
        const falData = await response.json();
        console.log('Fal.ai response:', falData);
        
        if (!response.ok) {
          const errorMessage = falData.error?.message || falData.detail || falData.error || 'Unknown error';
          throw new Error(`Fal.ai error: ${errorMessage}`);
        }
        
        // Handle different response formats from Fal.ai
        if (Array.isArray(falData)) {
          imageUrl = falData[0]?.url;
        } else if (falData.images) {
          imageUrl = falData.images[0]?.url;
        } else if (falData.image) {
          imageUrl = falData.image.url;
        }
        
        cost = model === 'flux1.1pro' ? 0.008 : model === 'lcm' ? 0.003 : 0.005;
        break;

      case 'openrouter':
        response = await fetch('https://openrouter.ai/api/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'Lovable Image Generator'
          },
          body: JSON.stringify({
            model,
            prompt,
          })
        });
        const openrouterData = await response.json();
        console.log('OpenRouter response:', openrouterData);
        
        if (!response.ok) {
          throw new Error(`OpenRouter error: ${openrouterData.error?.message || 'Unknown error'}`);
        }
        
        imageUrl = openrouterData.data?.[0]?.url;
        cost = model === 'dall-e-3' ? 0.040 : 0.008;
        break;

      default:
        throw new Error('Invalid provider');
    }

    if (!imageUrl) {
      console.error('No image URL found in provider response');
      throw new Error('No image URL in provider response');
    }

    return new Response(
      JSON.stringify({ 
        url: imageUrl,
        cost,
        provider,
        model,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})