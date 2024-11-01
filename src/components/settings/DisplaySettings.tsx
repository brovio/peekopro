import { useSettings } from "@/contexts/SettingsContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const DisplaySettings = () => {
  const { showProgress, toggleProgress } = useSettings();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Display Options</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-progress"
            checked={showProgress}
            onCheckedChange={toggleProgress}
          />
          <Label htmlFor="show-progress">Show progress bars and completion status</Label>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;