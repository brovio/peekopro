import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ZoomIn } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { styleOptions } from "@/components/image-creator/StyleOptions";
import { providers } from "@/components/image-creator/ProviderSelector";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  provider: string;
  model: string;
  styles: string[];
  width: number;
  height: number;
  format: string;
  cost: number;
  created_at: string;
}

const filterImages = (
  images: GeneratedImage[] | undefined, 
  selectedProvider: string, 
  selectedModel: string, 
  selectedStyle: string
): GeneratedImage[] => {
  if (!images) return [];

  return images.filter(image => {
    const providerMatch = !selectedProvider || image.provider === selectedProvider;
    const modelMatch = !selectedModel || image.model === selectedModel;
    const styleMatch = !selectedStyle || (image.styles && image.styles.includes(selectedStyle));
    
    return providerMatch && modelMatch && styleMatch;
  });
};

const groupImagesByProviderModel = (images: GeneratedImage[]): Record<string, GeneratedImage[]> => {
  return images.reduce((acc, image) => {
    const key = `${image.provider} - ${image.model}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(image);
    return acc;
  }, {} as Record<string, GeneratedImage[]>);
};

const Gallery = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const { data: images, isLoading } = useQuery({
    queryKey: ['generated-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GeneratedImage[];
    }
  });

  const filteredImages = filterImages(images, selectedProvider, selectedModel, selectedStyle);
  const groupedImages = groupImagesByProviderModel(filteredImages);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Image Gallery</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="w-full sm:w-auto">
          <Select 
            value={selectedProvider} 
            onValueChange={(value) => {
              setSelectedProvider(value);
              setSelectedModel(""); // Reset model when provider changes
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map(provider => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProvider && selectedProvider !== "all" && (
          <div className="w-full sm:w-auto">
            <Select 
              value={selectedModel} 
              onValueChange={setSelectedModel}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {providers
                  .find(p => p.id === selectedProvider)
                  ?.models.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="w-full sm:w-auto">
          <Select 
            value={selectedStyle} 
            onValueChange={setSelectedStyle}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {styleOptions.map(style => (
                <SelectItem key={style.id} value={style.id}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !filteredImages || filteredImages.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No images found matching your criteria
        </div>
      ) : (
        Object.entries(groupedImages).map(([group, groupImages]) => (
          <div key={group} className="mb-12">
            <h2 className="text-xl font-semibold mb-4">{group}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {groupImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setSelectedImage(image)}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
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
              ))}
            </div>
          </div>
        ))
      )}

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.prompt}
                className="w-full h-auto"
              />
              <div className="space-y-2">
                <h3 className="font-semibold">Prompt</h3>
                <p>{selectedImage.prompt}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Details</h4>
                    <p className="text-sm">Provider: {selectedImage.provider}</p>
                    <p className="text-sm">Model: {selectedImage.model}</p>
                    <p className="text-sm">Size: {selectedImage.width}x{selectedImage.height}</p>
                    <p className="text-sm">Format: {selectedImage.format}</p>
                    <p className="text-sm">Cost: ${selectedImage.cost}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Styles</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedImage.styles?.map((style) => (
                        <span
                          key={style}
                          className="text-xs bg-secondary px-2 py-1 rounded-full"
                        >
                          {styleOptions.find(s => s.id === style)?.label || style}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;