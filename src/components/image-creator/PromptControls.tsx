import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Wand2, Loader2, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
                  onClick={() => onGeneratePrompts(promptCount)}
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

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => onGeneratePrompts(1)}
                  disabled={isGenerating || !prompt}
                  variant="outline"
                  className="flex-1"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Initial Prompt
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isGenerating ? 
                  "Please wait while your prompt is being enhanced..." :
                  "Generate an enhanced version of your initial prompt"
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