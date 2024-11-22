import { Card } from "@/components/ui/card";

interface EnhancedPromptCardProps {
  prompt: string;
  provider: string;
  model: string;
  styles: string[];
  width: number;
  height: number;
  imageUrl: string;
}

const EnhancedPromptCard = ({ 
  prompt, 
  provider, 
  model, 
  styles,
  width,
  height,
  imageUrl
}: EnhancedPromptCardProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Image</h3>
          <div className="aspect-square w-full relative bg-muted rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={prompt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Generation Details</h4>
          <p className="text-sm text-muted-foreground">{prompt}</p>
          <div className="text-sm text-muted-foreground">
            <p>Provider: {provider}</p>
            <p>Model: {model}</p>
            <p>Size: {width}x{height}</p>
            {styles.length > 0 && (
              <p>Styles: {styles.join(', ')}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedPromptCard;