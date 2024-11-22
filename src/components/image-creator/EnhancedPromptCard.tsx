import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageGenerationArea from "./ImageGenerationArea";

interface EnhancedPromptCardProps {
  prompt: string;
  provider: string;
  model: string;
  styles: string[];
  width: number;
  height: number;
}

const EnhancedPromptCard = ({ 
  prompt, 
  provider, 
  model, 
  styles,
  width,
  height
}: EnhancedPromptCardProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Enhanced Prompt</h3>
          <div className="flex gap-2">
            <Select defaultValue="prompt1">
              <SelectTrigger className="w-full bg-secondary hover:bg-secondary/80 transition-colors">
                <SelectValue placeholder="Select prompt variation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prompt1">Prompt Variation 1</SelectItem>
                <SelectItem value="prompt2">Prompt Variation 2</SelectItem>
                <SelectItem value="prompt3">Prompt Variation 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">{prompt}</p>
          </div>
        </div>
        <ImageGenerationArea
          prompt={prompt}
          provider={provider}
          model={model}
          styles={styles}
          width={width}
          height={height}
        />
      </div>
    </Card>
  );
};

export default EnhancedPromptCard;