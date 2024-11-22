import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GeneratedImage } from "@/components/gallery/types";

interface EnhancedPromptAreaProps {
  prompts: string[];
  selectedPrompt: string;
  onPromptSelect: (prompt: string) => void;
  onGenerateImage: (prompt: string) => Promise<void>;
  onGenerateAll?: () => Promise<void>;
  isGenerating: boolean;
  provider: string;
  model: string;
  generatedImages?: GeneratedImage[];
}

const EnhancedPromptArea = ({
  prompts,
  selectedPrompt,
  onPromptSelect,
  onGenerateImage,
  onGenerateAll,
  isGenerating,
  provider,
  model,
}: EnhancedPromptAreaProps) => {
  const handleGenerateImage = async () => {
    if (selectedPrompt) {
      await onGenerateImage(selectedPrompt);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={selectedPrompt} onValueChange={onPromptSelect}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a prompt" />
          </SelectTrigger>
          <SelectContent>
            {prompts.map((prompt, index) => (
              <SelectItem key={index} value={prompt}>
                Prompt {index + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleGenerateImage}
                disabled={isGenerating || !selectedPrompt || !provider || !model}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Image"
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isGenerating ? 
                "Please wait while your image is being generated..." :
                !provider ? "Please select a provider" :
                !model ? "Please select a model" :
                !selectedPrompt ? "Please select a prompt" :
                "Click to generate an image from your prompt"
              }
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {prompts.length > 1 && onGenerateAll && (
          <Button
            variant="secondary"
            onClick={onGenerateAll}
            disabled={isGenerating || !provider || !model}
          >
            Generate All
          </Button>
        )}
      </div>

      {selectedPrompt && (
        <div className="space-y-4">
          <div className="bg-card/50 p-4 rounded-lg">
            <p className="text-sm text-foreground">{selectedPrompt}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPromptArea;