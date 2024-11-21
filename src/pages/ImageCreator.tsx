import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/layout/Header";
import { Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";

const providers = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    models: [
      { id: 'dall-e-3', name: 'DALL-E 3', cost: '$0.040' }
    ]
  },
  { 
    id: 'fal', 
    name: 'Fal.ai', 
    models: [
      { id: 'fast-sdxl', name: 'Fast SDXL', cost: '$0.005' },
      { id: 'flux1.1pro', name: 'FLUX 1.1 Pro', cost: '$0.008' },
      { id: 'lcm', name: 'LCM', cost: '$0.003' }
    ]
  },
  { 
    id: 'openrouter', 
    name: 'OpenRouter', 
    models: [
      { id: 'sdxl', name: 'Stable Diffusion XL', cost: '$0.008' },
      { id: 'playground-v2', name: 'Playground v2', cost: '$0.008' },
      { id: 'kandinsky-2.2', name: 'Kandinsky 2.2', cost: '$0.007' },
      { id: 'dall-e-3', name: 'DALL-E 3 (via OpenRouter)', cost: '$0.040' }
    ]
  },
];

const styleOptions = [
  { id: 'abstract', label: 'Abstract Art' },
  { id: 'ad', label: 'Advertisement' },
  { id: 'website', label: 'Website Photos' },
  { id: 'background', label: 'Background Images' },
  { id: 'warm', label: 'Warm Tones' },
  { id: 'cold', label: 'Cold Tones' },
  { id: 'bw', label: 'Black and White' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'futuristic', label: 'Futuristic' },
  { id: 'nature', label: 'Nature-inspired' },
  { id: 'geometric', label: 'Geometric' }
];

const ImageCreator = () => {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const { toast } = useToast();

  const selectedProvider = providers.find(p => p.id === provider);

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
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt, 
          provider,
          model 
        }
      });

      if (error) throw error;

      setGeneratedImage(data.url || data.images?.[0]?.url);
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
              <div>
                <label className="block text-sm font-medium mb-2">Provider</label>
                <Select onValueChange={setProvider} value={provider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {provider && (
                <div>
                  <label className="block text-sm font-medium mb-2">Model</label>
                  <Select onValueChange={setModel} value={model}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProvider?.models.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name} ({m.cost})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Style Options</label>
                <div className="grid grid-cols-2 gap-4">
                  {styleOptions.map((style) => (
                    <div key={style.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={style.id}
                        checked={selectedStyles.includes(style.id)}
                        onCheckedChange={(checked) => {
                          setSelectedStyles(
                            checked
                              ? [...selectedStyles, style.id]
                              : selectedStyles.filter((id) => id !== style.id)
                          );
                        }}
                      />
                      <label htmlFor={style.id} className="text-sm">
                        {style.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

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
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Enhanced Prompts</label>
                  <div className="space-y-2">
                    {generatedPrompts.map((enhancedPrompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start h-auto whitespace-normal text-left"
                        onClick={() => setPrompt(enhancedPrompt)}
                      >
                        {enhancedPrompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

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
          </Card>

          <Card className="p-6">
            <div className="aspect-square w-full bg-muted rounded-lg overflow-hidden">
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Generated image will appear here
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageCreator;