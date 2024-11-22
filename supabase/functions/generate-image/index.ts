import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const VALID_DALLE_DIMENSIONS = [
  '1024x1024',
  '1024x1792',
  '1792x1024'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, provider, model, width = 1024, height = 1024 } = await req.json();
    let imageData;
    let cost = 0;

    console.log(`Generating image with provider: ${provider}, model: ${model}`);
    console.log(`Prompt: ${prompt}`);
    console.log(`Dimensions: ${width}x${height}`);

    const dimensionString = `${width}x${height}`;

    switch (provider) {
      case 'openai':
        if (!VALID_DALLE_DIMENSIONS.includes(dimensionString)) {
          throw new Error(`Invalid dimensions for DALL-E 3. Must be one of: ${VALID_DALLE_DIMENSIONS.join(', ')}`);
        }

        const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: dimensionString,
            response_format: 'b64_json'
          })
        });
        
        if (!openaiResponse.ok) {
          const error = await openaiResponse.json();
          throw new Error(`OpenAI error: ${error.error?.message || 'Unknown error'}`);
        }
        
        const openaiData = await openaiResponse.json();
        imageData = openaiData.data?.[0]?.b64_json;
        if (!imageData) {
          throw new Error('No image data received from OpenAI');
        }
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
        
        const falResponse = await fetch(`https://fal.run/v1/${falEndpoint}`, {
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
            num_inference_steps: 50,
            response_format: 'b64_json'
          })
        });
        
        if (!falResponse.ok) {
          const error = await falResponse.json();
          throw new Error(`Fal.ai error: ${error.error?.message || error.detail || 'Unknown error'}`);
        }
        
        const falData = await falResponse.json();
        imageData = falData.images?.[0]?.b64_json || falData.image?.b64_json;
        if (!imageData) {
          throw new Error('No image data received from Fal.ai');
        }
        
        cost = model === 'flux1.1pro' ? 0.008 : model === 'lcm' ? 0.003 : 0.005;
        break;

      default:
        throw new Error('Invalid provider');
    }

    return new Response(
      JSON.stringify({ 
        imageData,
        cost,
        format: 'png',
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