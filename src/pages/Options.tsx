import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { Minus, Plus } from "lucide-react";
import Header from "@/components/layout/Header";

const Options = () => {
  const { theme, setTheme } = useTheme();
  const [showToasts, setShowToasts] = useState(true);
  const [fontSize, setFontSize] = useState(16);

  const handleFontSizeChange = (increment: boolean) => {
    setFontSize(prev => {
      const newSize = increment ? prev + 1 : prev - 1;
      return Math.min(Math.max(12, newSize), 24); // Limit between 12px and 24px
      document.documentElement.style.setProperty('--base-font-size', `${newSize}px`);
      return newSize;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onShowApiManager={() => {}} />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-bold mb-6">Options</h1>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="theme">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
            </div>
            <Switch
              id="theme"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="toasts">Toast Notifications</Label>
              <p className="text-sm text-muted-foreground">Show notification toasts</p>
            </div>
            <Switch
              id="toasts"
              checked={showToasts}
              onCheckedChange={setShowToasts}
            />
          </div>

          <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
            <div className="space-y-1">
              <Label>Font Size</Label>
              <p className="text-sm text-muted-foreground">Adjust the base font size</p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleFontSizeChange(false)}
                disabled={fontSize <= 12}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[3ch] text-center">{fontSize}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleFontSizeChange(true)}
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
      </div>
    </div>
  );
};

export default Options;