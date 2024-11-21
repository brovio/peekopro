import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const providers = [
  { id: 'openai', name: 'OpenAI DALL-E 3', cost: '$0.040' },
  { id: 'fal', name: 'Fal.ai Fast SDXL', cost: '$0.005' },
  { id: 'openrouter', name: 'OpenRouter SDXL', cost: '$0.008' },
];

const ImageCreator = () => {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt || !provider) {
      toast({
        title: "Missing information",
        description: "Please provide a prompt and select a provider",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, provider }
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
                        {p.name} ({p.cost})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prompt</label>
                <Textarea
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isLoading || !prompt || !provider}
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