import { Card } from "@/components/ui/card";

interface ImagePreviewProps {
  generatedImage: string | null;
  metadata?: {
    prompt: string;
    model: string;
    provider: string;
    styles: string[];
  };
}

const ImagePreview = ({ generatedImage, metadata }: ImagePreviewProps) => {
  return (
    <Card className="p-6">
      <div className="aspect-square w-full bg-muted rounded-lg overflow-hidden mb-4">
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
      {metadata && generatedImage && (
        <div className="space-y-2 text-sm">
          <h3 className="font-medium">Generation Details:</h3>
          <p><strong>Prompt:</strong> {metadata.prompt}</p>
          <p><strong>Provider:</strong> {metadata.provider}</p>
          <p><strong>Model:</strong> {metadata.model}</p>
          {metadata.styles.length > 0 && (
            <p><strong>Styles:</strong> {metadata.styles.join(', ')}</p>
          )}
        </div>
      )}
    </Card>
  );
};

export default ImagePreview;