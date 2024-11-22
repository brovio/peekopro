import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnhancedPromptAreaProps {
  prompts: string[];
  selectedPrompt: string;
  onPromptSelect: (prompt: string) => void;
  onGenerateImage: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

const EnhancedPromptArea = ({
  prompts,
  selectedPrompt,
  onPromptSelect,
  onGenerateImage,
  isGenerating,
}: EnhancedPromptAreaProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={selectedPrompt} onValueChange={onPromptSelect}>
          <SelectTrigger className="w-[200px] border border-input bg-navy-800 hover:bg-navy-900">
            <SelectValue placeholder="Select a prompt" />
          </SelectTrigger>
          <SelectContent className="bg-navy-800 border border-input">
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
                onClick={() => onGenerateImage(selectedPrompt)}
                disabled={isGenerating || !selectedPrompt}
                className="ml-auto"
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
                "Click to generate an image from your prompt"
              }
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {selectedPrompt && (
        <div className="space-y-4">
          <div className="bg-card/50 p-4 rounded-lg w-full">
            <p className="text-sm text-foreground">{selectedPrompt}</p>
          </div>
          <div className="w-full aspect-[16/9] bg-card/30 rounded-lg flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Generated image will appear here
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPromptArea;