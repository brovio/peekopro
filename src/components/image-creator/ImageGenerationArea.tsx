import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ImagePreview from "./ImagePreview";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageGenerationAreaProps {
  prompt: string;
  provider: string;
  model: string;
  styles: string[];
}

const ImageGenerationArea = ({ prompt, provider, model, styles }: ImageGenerationAreaProps) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const handleGenerate = async () => {
    if (!prompt || !provider || !model) {
      toast({
        title: "Missing information",
        description: "Please provide a prompt and select a provider and model",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt, 
          provider,
          model 
        }
      });

      if (error) throw error;

      const imageUrl = data.url || data.images?.[0]?.url;
      if (!imageUrl) throw new Error("No image URL in response");

      // Save the generated image to the database with user_id
      const { error: dbError } = await supabase
        .from('generated_images')
        .insert({
          url: imageUrl,
          prompt,
          provider,
          model,
          styles,
          width: data.width || 1024,
          height: data.height || 1024,
          format: data.format || 'png',
          cost: data.cost || 0,
          user_id: user.id // Add the user_id here
        });

      if (dbError) throw dbError;

      setGeneratedImage(imageUrl);
      setMetadata({
        prompt,
        model,
        provider,
        styles,
        width: data.width || 1024,
        height: data.height || 1024,
        format: data.format || 'png',
        cost: data.cost || 0
      });
      
      toast({
        title: "Image generated",
        description: `Cost: $${data.cost}`,
      });
    } catch (error: any) {
      console.error('Image generation error:', error);
      setError(error.message);
      toast({
        title: "Error generating image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          onClick={handleGenerate}
          disabled={isLoading || !prompt || !provider || !model}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Image'
          )}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          Error: {error}
        </div>
      )}

      <ImagePreview 
        generatedImage={generatedImage} 
        metadata={metadata}
      />
    </div>
  );
};

export default ImageGenerationArea;