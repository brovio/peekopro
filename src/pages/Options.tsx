import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Header from "@/components/layout/Header";
import { useToast } from "@/components/ui/use-toast";
import OptionsHeader from "@/components/settings/OptionsHeader";
import ToastSettings from "@/components/settings/ToastSettings";
import FontSettings from "@/components/settings/FontSettings";
import ThemeSettings from "@/components/settings/ThemeSettings";

const Options = () => {
  const { theme, setTheme } = useTheme();
  const [showToasts, setShowToasts] = useState(() => {
    const saved = localStorage.getItem('showToasts');
    return saved ? saved === 'true' : true;
  });
  const [fontSize, setFontSize] = useState(16);
  const [toastColor, setToastColor] = useState('bg-[#9b87f5]');
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
        
        <div className="space-y-8">
          <ThemeSettings />
          
          <ToastSettings
            showToasts={showToasts}
            toastDuration={toastDuration}
            toastColor={toastColor}
            onToastToggle={handleToastToggle}
            onDurationChange={handleDurationChange}
            onColorChange={handleColorChange}
            onPreviewToast={previewToast}
          />
          
          <FontSettings
            fontSize={fontSize}
            onFontSizeChange={handleFontSizeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Options;