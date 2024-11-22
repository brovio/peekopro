import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { styleOptions } from "@/components/image-creator/StyleOptionsData";
import { providers } from "@/components/image-creator/ProviderSelector";
import Header from "@/components/layout/Header";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";
import { ImageCard } from "@/components/gallery/ImageCard";
import type { GeneratedImage } from "@/components/gallery/types";
import { useToast } from "@/hooks/use-toast";

const filterImages = (
  images: GeneratedImage[] | undefined, 
  selectedProvider: string, 
  selectedModel: string, 
  selectedStyle: string
): GeneratedImage[] => {
  if (!images) return [];

  return images.filter(image => {
    const providerMatch = selectedProvider === "all" || image.provider === selectedProvider;
    const modelMatch = selectedModel === "all" || image.model === selectedModel;
    const styleMatch = selectedStyle === "all" || (image.styles && image.styles.includes(selectedStyle));
    
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
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showApiManager, setShowApiManager] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const deleteImagesMutation = useMutation({
    mutationFn: async (imageIds: string[]) => {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .in('id', imageIds);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generated-images'] });
      setSelectedImages(new Set());
      toast({
        title: "Images deleted",
        description: "Selected images have been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete images",
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedImages);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedImages(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.size === 0) return;
    deleteImagesMutation.mutate(Array.from(selectedImages));
  };

  const filteredImages = filterImages(images, selectedProvider, selectedModel, selectedStyle);
  const groupedImages = groupImagesByProviderModel(filteredImages);

  return (
    <div className="min-h-screen bg-background">
      <Header onShowApiManager={() => setShowApiManager(true)} />
      <div className="container mx-auto px-4 py-8">
        <GalleryHeader 
          selectedCount={selectedImages.size}
          onDeleteSelected={handleDeleteSelected}
        />

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="w-full sm:w-auto">
            <Select 
              value={selectedProvider} 
              onValueChange={(value) => {
                setSelectedProvider(value);
                setSelectedModel("all");
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

          {selectedProvider !== "all" && (
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
                  <ImageCard
                    key={image.id}
                    image={image}
                    isSelected={selectedImages.has(image.id)}
                    onSelect={handleImageSelect}
                    onImageClick={setSelectedImage}
                  />
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
    </div>
  );
};

export default Gallery;