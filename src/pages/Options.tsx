import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { Minus, Plus } from "lucide-react";
import Header from "@/components/layout/Header";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const TOAST_COLORS = [
  { name: "Purple", value: "bg-[#9b87f5]" },
  { name: "Blue", value: "bg-[#0EA5E9]" },
  { name: "Green", value: "bg-[#22C55E]" },
  { name: "Orange", value: "bg-[#F97316]" },
  { name: "Pink", value: "bg-[#D946EF]" },
];

const Options = () => {
  const { theme, setTheme } = useTheme();
  const [showToasts, setShowToasts] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [toastColor, setToastColor] = useState(TOAST_COLORS[0].value);
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // Get saved preferences from localStorage
    const savedFontSize = localStorage.getItem('appFontSize');
    const savedShowToasts = localStorage.getItem('showToasts');
    const savedToastColor = localStorage.getItem('toastColor');

    if (savedFontSize) setFontSize(Number(savedFontSize));
    if (savedShowToasts) setShowToasts(savedShowToasts === 'true');
    if (savedToastColor) setToastColor(savedToastColor);
  }, []);

  const handleFontSizeChange = (increment: boolean) => {
    setFontSize(prev => {
      const newSize = increment ? prev + 1 : prev - 1;
      const finalSize = Math.min(Math.max(12, newSize), 24);
      setHasUnsavedChanges(true);
      return finalSize;
    });
  };

  const handleToastToggle = (checked: boolean) => {
    setShowToasts(checked);
    setHasUnsavedChanges(true);
    if (checked) {
      toast({
        title: "Sample Notification",
        description: "Flooko Toasty Bread Sample",
        className: `${toastColor} bg-opacity-90 text-white`,
      });
    }
  };

  const handleColorChange = (value: string) => {
    setToastColor(value);
    setHasUnsavedChanges(true);
    toast({
      title: "Sample Notification",
      description: "Flooko Toasty Bread Sample",
      className: `${value} bg-opacity-90 text-white`,
    });
  };

  const saveChanges = () => {
    // Save all preferences to localStorage
    localStorage.setItem('appFontSize', fontSize.toString());
    localStorage.setItem('showToasts', showToasts.toString());
    localStorage.setItem('toastColor', toastColor);
    
    // Apply font size to document root
    document.documentElement.style.fontSize = `${fontSize}px`;
    
    setHasUnsavedChanges(false);
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
      className: `${toastColor} bg-opacity-90 text-white`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onShowApiManager={() => {}} />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Options</h1>
          {hasUnsavedChanges && (
            <Button onClick={saveChanges} variant="default">
              Save Changes
            </Button>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="theme">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
            </div>
            <Switch
              id="theme"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => {
                setTheme(checked ? 'dark' : 'light');
                setHasUnsavedChanges(true);
              }}
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
              onCheckedChange={handleToastToggle}
            />
          </div>

          {showToasts && (
            <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
              <Label>Toast Color</Label>
              <RadioGroup 
                value={toastColor} 
                onValueChange={handleColorChange}
                className="grid grid-cols-2 gap-4 sm:grid-cols-5"
              >
                {TOAST_COLORS.map((color) => (
                  <div key={color.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={color.value} id={color.value} />
                    <Label htmlFor={color.value} className="flex items-center gap-2">
                      {color.name}
                      <div className={`w-4 h-4 rounded ${color.value}`} />
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

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