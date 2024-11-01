import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Theme Preferences</h3>
      <RadioGroup value={theme} onValueChange={setTheme}>
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