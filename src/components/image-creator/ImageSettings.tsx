import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface ImageSettings {
  aspectRatio: string;
  orientation: string;
  width: number;
  height: number;
}

interface ImageSettingsProps {
  settings: ImageSettings;
  onSettingsChange: (settings: ImageSettings) => void;
}

const DALLE_DIMENSIONS = [
  { width: 1024, height: 1024, label: "Square (1024x1024)" },
  { width: 1792, height: 1024, label: "Landscape (1792x1024)" },
  { width: 1024, height: 1792, label: "Portrait (1024x1792)" },
];

const ImageSettings = ({ settings, onSettingsChange }: ImageSettingsProps) => {
  const handleDimensionChange = (value: string) => {
    const [width, height] = value.split('x').map(Number);
    const newSettings = { 
      ...settings, 
      width, 
      height,
      aspectRatio: width === height ? "1:1" : width > height ? "16:9" : "9:16",
      orientation: width === height ? "square" : width > height ? "landscape" : "portrait"
    };
    onSettingsChange(newSettings);
  };

  const currentDimension = `${settings.width}x${settings.height}`;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Image Dimensions</Label>
        <Select 
          value={currentDimension}
          onValueChange={handleDimensionChange}
        >
          <SelectTrigger className="border border-input bg-background">
            <SelectValue placeholder="Select dimensions" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-input">
            {DALLE_DIMENSIONS.map((dim) => (
              <SelectItem 
                key={`${dim.width}x${dim.height}`} 
                value={`${dim.width}x${dim.height}`}
              >
                {dim.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ImageSettings;