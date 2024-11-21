import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

interface FontSettingsProps {
  fontSize: number;
  onFontSizeChange: (increment: boolean) => void;
}

const FontSettings = ({ fontSize, onFontSizeChange }: FontSettingsProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Font Settings</h3>
      <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
        <div className="space-y-1">
          <Label>Font Size</Label>
          <p className="text-sm text-muted-foreground">Adjust the base font size</p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onFontSizeChange(false)}
            disabled={fontSize <= 12}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-[3ch] text-center">{fontSize}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onFontSizeChange(true)}
            disabled={fontSize >= 24}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 p-4 bg-background rounded border">
          <p style={{ fontSize: `${fontSize}px` }}>Sample Flooke</p>
        </div>
      </div>
    </div>
  );
};

export default FontSettings;