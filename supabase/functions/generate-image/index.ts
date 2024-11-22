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
  width?: number;
  height?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, provider, model, width = 1024, height = 1024 } = await req.json() as ImageRequest;
    let response;
    let cost = 0;
    let imageUrl;
    let format = 'png';

    console.log(`Generating image with provider: ${provider}, model: ${model}`);
    console.log(`Prompt: ${prompt}`);
    console.log(`Dimensions: ${width}x${height}`);

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
            size: `${width}x${height}`,
            response_format: 'url'
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(`OpenAI error: ${error.error?.message || 'Unknown error'}`);
        }
        
        const openaiData = await response.json();
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
            height,
            width,
            scheduler: "K_EULER",
            num_inference_steps: 50
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Fal.ai error: ${error.error?.message || error.detail || 'Unknown error'}`);
        }
        
        const falData = await response.json();
        
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
        format,
        provider,
        model,
        width,
        height,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
})