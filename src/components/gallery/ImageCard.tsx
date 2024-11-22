import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Share2, ZoomIn } from "lucide-react";
import { GeneratedImage } from "./types";
import { styleOptions } from "@/components/image-creator/StyleOptionsData";

interface ImageCardProps {
  image: GeneratedImage;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onImageClick: (image: GeneratedImage) => void;
}

export function ImageCard({ image, isSelected, onSelect, onImageClick }: ImageCardProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${image.id}.${image.format || 'png'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Generated Image',
          text: image.prompt,
          url: image.url,
        });
      } else {
        await navigator.clipboard.writeText(image.url);
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  return (
    <Card className="overflow-hidden group relative">
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(image.id, checked as boolean)}
          className="bg-background/80 backdrop-blur-sm"
        />
      </div>
      <div className="relative aspect-square">
        <img
          src={image.url}
          alt={image.prompt}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => onImageClick(image)}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onImageClick(image)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-sm line-clamp-2" title={image.prompt}>
          {image.prompt}
        </p>
        <div className="flex flex-wrap gap-1">
          {image.styles?.map((style) => (
            <span
              key={style}
              className="text-xs bg-secondary px-2 py-1 rounded-full"
            >
              {styleOptions.find(s => s.id === style)?.label || style}
            </span>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">
          <p>Size: {image.width}x{image.height}</p>
          <p>Format: {image.format}</p>
          <p>Cost: ${image.cost}</p>
        </div>
      </div>
    </Card>
  );
}
