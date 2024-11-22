import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Loader2, Wand2 } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePromptHistory } from "@/hooks/usePromptHistory";

interface PromptControlsProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGeneratePrompts: (count: number) => void;
  isGenerating: boolean;
}

const PromptControls = ({
  prompt,
  onPromptChange,
  onGeneratePrompts,
  isGenerating
}: PromptControlsProps) => {
  const [promptCount, setPromptCount] = useState(5);
  const { promptHistory, addPrompt } = usePromptHistory();

  const handleGeneratePrompts = async () => {
    if (!prompt.trim()) return;
    await addPrompt(prompt);
    onGeneratePrompts(promptCount);
  };

  return (
    <div className="space-y-6 bg-card p-6 rounded-lg border">
      <div>
        <label className="block text-sm font-medium mb-2">Initial Prompt</label>
        <Textarea
          placeholder="Describe your image idea..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        {promptHistory.length > 0 && (
          <div className="mt-2">
            <label className="block text-sm font-medium mb-2">Recent Prompts</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {promptHistory.map((item: any) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start text-left text-sm"
                  onClick={() => onPromptChange(item.prompt)}
                >
                  {item.prompt}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Prompts: {promptCount}
          </label>
          <Slider
            value={[promptCount]}
            onValueChange={(value) => setPromptCount(value[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleGeneratePrompts}
                  disabled={isGenerating || !prompt}
                  variant="secondary"
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating prompts...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Advanced Prompts
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isGenerating ? 
                  "Please wait while advanced prompts are being generated..." :
                  "Generate multiple enhanced versions of your prompt"
                }
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default PromptControls;