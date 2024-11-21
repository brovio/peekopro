import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import { Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProviderSelector from "@/components/image-creator/ProviderSelector";
import StyleOptions from "@/components/image-creator/StyleOptions";
import PromptList from "@/components/image-creator/PromptList";
import ImagePreview from "@/components/image-creator/ImagePreview";

const ImageCreator = () => {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [generatingPromptId, setGeneratingPromptId] = useState<string | null>(null);
  const [imageMetadata, setImageMetadata] = useState<{
    prompt: string;
    model: string;
    provider: string;
    styles: string[];
  } | null>(null);
  const { toast } = useToast();

  const generatePrompts = async () => {
    if (!prompt) {
      toast({
        title: "Missing information",
        description: "Please provide an initial prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPrompts(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prompts', {
        body: { 
          basePrompt: prompt,
          styles: selectedStyles,
          count: 5
        }
      });

      if (error) throw error;

      setGeneratedPrompts(data.prompts);
      toast({
        title: "Prompts generated",
        description: "Select a prompt to use it for image generation",
      });
    } catch (error: any) {
      toast({
        title: "Error generating prompts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  const handleGenerate = async (promptToUse: string = prompt) => {
    if (!promptToUse || !provider || !model) {
      toast({
        title: "Missing information",
        description: "Please provide a prompt and select a provider and model",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratingPromptId(promptToUse);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt: promptToUse, 
          provider,
          model 
        }
      });

      if (error) throw error;

      const imageUrl = data.url || data.images?.[0]?.url;
      setGeneratedImage(imageUrl);
      setImageMetadata({
        prompt: promptToUse,
        model,
        provider,
        styles: selectedStyles,
      });
      
      toast({
        title: "Image generated",
        description: `Cost: ${data.cost}`,
      });
    } catch (error: any) {
      toast({
        title: "Error generating image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setGeneratingPromptId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onShowApiManager={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">AI Image Creator</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <ProviderSelector
                provider={provider}
                model={model}
                onProviderChange={setProvider}
                onModelChange={setModel}
              />

              <StyleOptions
                selectedStyles={selectedStyles}
                onStyleChange={setSelectedStyles}
              />

              <div>
                <label className="block text-sm font-medium mb-2">Initial Prompt</label>
                <Textarea
                  placeholder="Describe your image idea..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                onClick={generatePrompts} 
                disabled={isGeneratingPrompts || !prompt}
                variant="secondary"
                className="w-full"
              >
                {isGeneratingPrompts ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating prompts...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate 5 Enhanced Prompts
                  </>
                )}
              </Button>

              {generatedPrompts.length > 0 && (
                <PromptList
                  prompts={generatedPrompts}
                  onSelectPrompt={setPrompt}
                  onGenerateImage={handleGenerate}
                  isGenerating={isLoading}
                  generatingPromptId={generatingPromptId}
                />
              )}

              <Button 
                onClick={() => handleGenerate()} 
                disabled={isLoading || !prompt || !provider || !model}
                className="w-full"
              >
                {isLoading && !generatingPromptId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Image'
                )}
              </Button>
            </div>
          </Card>

          <ImagePreview generatedImage={generatedImage} metadata={imageMetadata} />
        </div>
      </div>
    </div>
  );
};

export default ImageCreator;