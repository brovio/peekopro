import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PromptListProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
  onGenerateImage: (prompt: string) => Promise<void>;
  isGenerating: boolean;
  generatingPromptId: string | null;
}

const PromptList = ({ 
  prompts, 
  onSelectPrompt, 
  onGenerateImage,
  isGenerating,
  generatingPromptId
}: PromptListProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Enhanced Prompts</label>
      <div className="space-y-2">
        {prompts.map((enhancedPrompt, index) => (
          <div key={index} className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 justify-start h-auto whitespace-normal text-left"
              onClick={() => onSelectPrompt(enhancedPrompt)}
            >
              {enhancedPrompt}
            </Button>
            <Button
              variant="secondary"
              onClick={() => onGenerateImage(enhancedPrompt)}
              disabled={isGenerating}
            >
              {isGenerating && generatingPromptId === enhancedPrompt ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptList;