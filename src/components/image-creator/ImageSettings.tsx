import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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

const ImageSettings = ({ settings, onSettingsChange }: ImageSettingsProps) => {
  const handleAspectRatioChange = (value: string) => {
    const newSettings = { ...settings, aspectRatio: value };
    if (value === "1:1") {
      newSettings.width = 1024;
      newSettings.height = 1024;
    } else if (value === "16:9") {
      newSettings.width = 1920;
      newSettings.height = 1080;
    } else if (value === "4:3") {
      newSettings.width = 1600;
      newSettings.height = 1200;
    }
    onSettingsChange(newSettings);
  };

  const handleOrientationChange = (value: string) => {
    const newSettings = { ...settings, orientation: value };
    if (value === "landscape" && settings.width < settings.height) {
      // Swap dimensions
      newSettings.width = settings.height;
      newSettings.height = settings.width;
    } else if (value === "portrait" && settings.width > settings.height) {
      // Swap dimensions
      newSettings.width = settings.height;
      newSettings.height = settings.width;
    }
    onSettingsChange(newSettings);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Aspect Ratio</Label>
          <Select 
            value={settings.aspectRatio} 
            onValueChange={handleAspectRatioChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select aspect ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1:1">1:1 Square</SelectItem>
              <SelectItem value="16:9">16:9 Widescreen</SelectItem>
              <SelectItem value="4:3">4:3 Standard</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Orientation</Label>
          <Select 
            value={settings.orientation} 
            onValueChange={handleOrientationChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select orientation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landscape">Landscape</SelectItem>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="square">Square</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Width (px)</Label>
          <Input
            type="number"
            value={settings.width}
            onChange={(e) => onSettingsChange({
              ...settings,
              width: parseInt(e.target.value)
            })}
            min={256}
            max={2048}
            step={64}
          />
        </div>

        <div className="space-y-2">
          <Label>Height (px)</Label>
          <Input
            type="number"
            value={settings.height}
            onChange={(e) => onSettingsChange({
              ...settings,
              height: parseInt(e.target.value)
            })}
            min={256}
            max={2048}
            step={64}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageSettings;