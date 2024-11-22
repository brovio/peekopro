import { Card } from "@/components/ui/card";
import { GeneratedImage } from "@/components/gallery/types";

interface GeneratedImagesGridProps {
  images: GeneratedImage[];
}

const GeneratedImagesGrid = ({ images }: GeneratedImagesGridProps) => {
  if (!images.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Generated Images</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-square">
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2">
              <p className="text-xs text-muted-foreground line-clamp-2">{image.prompt}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GeneratedImagesGrid;