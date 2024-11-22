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
  width: number;
  height: number;
}

const ImageGenerationArea = ({ 
  prompt, 
  provider, 
  model, 
  styles,
  width,
  height 
}: ImageGenerationAreaProps) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const uploadImageToStorage = async (base64Data: string) => {
    try {
      const response = await fetch(`data:image/png;base64,${base64Data}`);
      const blob = await response.blob();
      
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(7);
      const filename = `${timestamp}-${randomString}.png`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('generated-images')
        .upload(filename, blob, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      if (!uploadData?.path) {
        throw new Error('No upload path returned from storage');
      }

      const { data } = supabase.storage
        .from('generated-images')
        .getPublicUrl(uploadData.path);

      if (!data.publicUrl) {
        throw new Error('No public URL returned from storage');
      }

      return data.publicUrl;
    } catch (error: any) {
      console.error('Error in uploadImageToStorage:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt, 
          provider,
          model,
          width,
          height
        }
      });

      if (error) throw error;

      if (!data.imageData) {
        throw new Error("No image data in response");
      }

      const storedImageUrl = await uploadImageToStorage(data.imageData);

      const { error: dbError } = await supabase
        .from('generated_images')
        .insert({
          url: storedImageUrl,
          prompt,
          provider,
          model,
          styles,
          width,
          height,
          format: data.format || 'png',
          cost: data.cost || 0,
          user_id: user.id
        });

      if (dbError) throw dbError;

      setGeneratedImage(storedImageUrl);
      setMetadata({
        prompt,
        model,
        provider,
        styles,
        width,
        height,
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
    <div className="space-y-3">
      <Button 
        onClick={handleGenerate}
        disabled={isLoading || !prompt || !provider || !model}
        className="w-full bg-primary hover:bg-primary/90"
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