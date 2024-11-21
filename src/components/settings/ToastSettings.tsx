import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, Minus, Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TOAST_COLORS = [
  { name: "Purple", value: "bg-[#9b87f5]" },
  { name: "Blue", value: "bg-[#0EA5E9]" },
  { name: "Green", value: "bg-[#22C55E]" },
  { name: "Orange", value: "bg-[#F97316]" },
  { name: "Pink", value: "bg-[#D946EF]" },
];

interface ToastSettingsProps {
  showToasts: boolean;
  toastDuration: number;
  toastColor: string;
  onToastToggle: (checked: boolean) => void;
  onDurationChange: (increment: boolean) => void;
  onColorChange: (value: string) => void;
  onPreviewToast: () => void;
}

const ToastSettings = ({
  showToasts,
  toastDuration,
  toastColor,
  onToastToggle,
  onDurationChange,
  onColorChange,
  onPreviewToast,
}: ToastSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Toast Notifications</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onPreviewToast}
                className="hover:bg-secondary"
              >
                <Eye className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview toast notification</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
        <div className="space-y-1">
          <Label htmlFor="toasts">Enable Notifications</Label>
          <p className="text-sm text-muted-foreground">Show notification toasts</p>
        </div>
        <Switch
          id="toasts"
          checked={showToasts}
          onCheckedChange={onToastToggle}
        />
      </div>

      {showToasts && (
        <>
          <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
            <Label>Toast Duration (seconds)</Label>
            <p className="text-sm text-muted-foreground">How long should notifications stay on screen?</p>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDurationChange(false)}
                disabled={toastDuration <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[3ch] text-center">{toastDuration}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDurationChange(true)}
                disabled={toastDuration >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
            <Label>Toast Color</Label>
            <RadioGroup 
              value={toastColor} 
              onValueChange={onColorChange}
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
        </>
      )}
    </div>
  );
};

export default ToastSettings;