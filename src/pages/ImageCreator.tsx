import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import { Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ProviderSelector from "@/components/image-creator/ProviderSelector";
import StyleOptions from "@/components/image-creator/StyleOptions";
import PromptList from "@/components/image-creator/PromptList";
import ImageGenerationArea from "@/components/image-creator/ImageGenerationArea";

const ImageCreator = () => {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
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

  return (
    <div className="min-h-screen bg-background">
      <Header onShowApiManager={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">AI Image Creator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Generated Prompts</h2>
                  {generatedPrompts.map((enhancedPrompt, index) => (
                    <Card key={index} className="p-4">
                      <p className="mb-4">{enhancedPrompt}</p>
                      <ImageGenerationArea
                        prompt={enhancedPrompt}
                        provider={provider}
                        model={model}
                        styles={selectedStyles}
                      />
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Main Generation Area</h2>
            <ImageGenerationArea
              prompt={prompt}
              provider={provider}
              model={model}
              styles={selectedStyles}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageCreator;