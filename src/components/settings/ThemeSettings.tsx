import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings } from "@/contexts/SettingsContext";

const ThemeSettings = () => {
  const { theme } = useTheme();
  const { setPendingTheme } = useSettings();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Theme Preferences</h3>
      <RadioGroup 
        value={theme} 
        onValueChange={(value) => setPendingTheme(value)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="light" id="light" />
          <Label htmlFor="light">Light</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dark" id="dark" />
          <Label htmlFor="dark">Dark</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="system" id="system" />
          <Label htmlFor="system">System</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ThemeSettings;