import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { Minus, Plus } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OptionsHeader from "@/components/settings/OptionsHeader";

const TOAST_COLORS = [
  { name: "Purple", value: "bg-[#9b87f5]" },
  { name: "Blue", value: "bg-[#0EA5E9]" },
  { name: "Green", value: "bg-[#22C55E]" },
  { name: "Orange", value: "bg-[#F97316]" },
  { name: "Pink", value: "bg-[#D946EF]" },
];

const Options = () => {
  const { theme, setTheme } = useTheme();
  const [showToasts, setShowToasts] = useState(() => {
    const saved = localStorage.getItem('showToasts');
    return saved ? saved === 'true' : true;
  });
  const [fontSize, setFontSize] = useState(16);
  const [toastColor, setToastColor] = useState(TOAST_COLORS[0].value);
  const [toastDuration, setToastDuration] = useState(() => {
    const saved = localStorage.getItem('toastDuration');
    return saved ? Number(saved) / 1000 : 3;
  });
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
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
  };

  const handleColorChange = (value: string) => {
    setToastColor(value);
    setHasUnsavedChanges(true);
  };

  const handleDurationChange = (increment: boolean) => {
    setToastDuration(prev => {
      const newDuration = increment ? prev + 1 : prev - 1;
      const finalDuration = Math.min(Math.max(1, newDuration), 10);
      setHasUnsavedChanges(true);
      return finalDuration;
    });
  };

  const previewToast = () => {
    if (showToasts) {
      toast({
        title: "Sample Notification",
        description: "Flooko Toasty Bread Sample",
        className: `${toastColor} bg-opacity-90 text-white`,
      });
    } else {
      toast({
        title: "Notifications Disabled",
        description: "Enable notifications to see the preview",
        variant: "destructive",
      });
    }
  };

  const saveChanges = () => {
    localStorage.setItem('appFontSize', fontSize.toString());
    localStorage.setItem('showToasts', showToasts.toString());
    localStorage.setItem('toastColor', toastColor);
    localStorage.setItem('toastDuration', (toastDuration * 1000).toString());
    
    document.documentElement.style.fontSize = `${fontSize}px`;
    
    setHasUnsavedChanges(false);
    
    if (showToasts) {
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully",
        className: `${toastColor} bg-opacity-90 text-white`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onShowApiManager={() => {}} />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <OptionsHeader
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={saveChanges}
          onPreviewToast={previewToast}
        />
        
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
              <Label>Toast Duration (seconds)</Label>
              <p className="text-sm text-muted-foreground">How long should notifications stay on screen?</p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDurationChange(false)}
                  disabled={toastDuration <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[3ch] text-center">{toastDuration}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDurationChange(true)}
                  disabled={toastDuration >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

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
