import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";
import ProviderSelector from "@/components/image-creator/ProviderSelector";
import StyleOptions from "@/components/image-creator/StyleOptions";
import ImageSettings, { ImageSettings as IImageSettings } from "@/components/image-creator/ImageSettings";
import PromptControls from "@/components/image-creator/PromptControls";
import EnhancedPromptArea from "@/components/image-creator/EnhancedPromptArea";

const ImageCreator = () => {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState("");
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
      setSelectedPrompt(data.prompts[0]);
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

  const generateImage = async (selectedPrompt: string) => {
    setIsGeneratingImage(true);
    // Implement image generation logic here
    setIsGeneratingImage(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onShowApiManager={() => {}} />
      <div className="container mx-auto p-4 lg:p-6">
        <h1 className="text-2xl font-bold mb-6">AI Image Creator</h1>
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column - Controls */}
          <div className="xl:col-span-5 space-y-4">
            <Card className="p-4">
              <ProviderSelector
                provider={provider}
                model={model}
                onProviderChange={setProvider}
                onModelChange={setModel}
              />
            </Card>

            <Card className="p-4">
              <ImageSettings
                settings={imageSettings}
                onSettingsChange={setImageSettings}
              />
            </Card>

            <StyleOptions
              selectedStyles={selectedStyles}
              onStyleChange={setSelectedStyles}
            />

            <PromptControls
              prompt={prompt}
              onPromptChange={setPrompt}
              onGeneratePrompts={generatePrompts}
              isGenerating={isGeneratingPrompts}
            />
          </div>

          {/* Right Column - Generated Content */}
          <div className="xl:col-span-7">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Generated Prompts</h2>
              <EnhancedPromptArea
                prompts={generatedPrompts}
                selectedPrompt={selectedPrompt}
                onPromptSelect={setSelectedPrompt}
                onGenerateImage={generateImage}
                isGenerating={isGeneratingImage}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCreator;
