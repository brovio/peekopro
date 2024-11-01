import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FocusModeToggleProps {
  onToggle: (enabled: boolean) => void;
}

const FocusModeToggle = ({ onToggle }: FocusModeToggleProps) => {
  const [enabled, setEnabled] = useState(false);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    onToggle(checked);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch id="focus-mode" checked={enabled} onCheckedChange={handleToggle} />
      <Label htmlFor="focus-mode">Focus Mode</Label>
    </div>
  );
};

export default FocusModeToggle;