import { Card } from "@/components/ui/card";
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
    <Card className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Enhanced Prompt</h3>
          <p className="text-sm text-muted-foreground">{prompt}</p>
        </div>
        <div>
          <ImageGenerationArea
            prompt={prompt}
            provider={provider}
            model={model}
            styles={styles}
            width={width}
            height={height}
          />
        </div>
      </div>
    </Card>
  );
};

export default EnhancedPromptCard;