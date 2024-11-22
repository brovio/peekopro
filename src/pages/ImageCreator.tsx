import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";
import ProviderSelector from "@/components/image-creator/ProviderSelector";
import StyleOptions from "@/components/image-creator/StyleOptions";
import ImageSettings, { ImageSettings as IImageSettings } from "@/components/image-creator/ImageSettings";
import EnhancedPromptCard from "@/components/image-creator/EnhancedPromptCard";
import PromptControls from "@/components/image-creator/PromptControls";

const ImageCreator = () => {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [imageSettings, setImageSettings] = useState<IImageSettings>({
    aspectRatio: "1:1",
    orientation: "square",
    width: 1024,
    height: 1024,
  });
  const { toast } = useToast();

  const generatePrompts = async (count: number) => {
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
          count: count
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

  return (
    <div className="min-h-screen bg-background">
      <Header onShowApiManager={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">AI Image Creator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6">
              <ProviderSelector
                provider={provider}
                model={model}
                onProviderChange={setProvider}
                onModelChange={setModel}
              />
            </Card>

            <StyleOptions
              selectedStyles={selectedStyles}
              onStyleChange={setSelectedStyles}
            />

            <Card className="p-6">
              <ImageSettings
                settings={imageSettings}
                onSettingsChange={setImageSettings}
              />
            </Card>

            <PromptControls
              prompt={prompt}
              onPromptChange={setPrompt}
              onGeneratePrompts={generatePrompts}
              isGenerating={isGeneratingPrompts}
            />
          </div>

          <div className="space-y-6">
            {generatedPrompts.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Generated Prompts</h2>
                {generatedPrompts.map((enhancedPrompt, index) => (
                  <EnhancedPromptCard
                    key={index}
                    prompt={enhancedPrompt}
                    provider={provider}
                    model={model}
                    styles={selectedStyles}
                    width={imageSettings.width}
                    height={imageSettings.height}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCreator;