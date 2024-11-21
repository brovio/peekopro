import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const THEME_OPTIONS = [
  {
    id: 'system',
    label: 'System',
    colors: ['#9b87f5', '#7E69AB', '#6E59A5', '#1A1F2C', '#D6BCFA', '#F2FCE2', '#FEF7CD', '#FEC6A1']
  },
  {
    id: 'light',
    label: 'Light',
    colors: ['#FFFFFF', '#F6F6F7', '#F1F1F1', '#888888', '#333333', '#555555', '#222222', '#000000']
  },
  {
    id: 'dark',
    label: 'Dark',
    colors: ['#1A1F2C', '#403E43', '#221F26', '#8A898C', '#C8C8C9', '#9F9EA1', '#F6F6F7', '#000000']
  },
  {
    id: 'zanely-1',
    label: 'Zanely Sunrise',
    colors: ['#FDE1D3', '#FEC6A1', '#F97316', '#D946EF', '#8B5CF6', '#0EA5E9', '#33C3F0', '#1EAEDB']
  },
  {
    id: 'zanely-2',
    label: 'Zanely Twilight',
    colors: ['#E5DEFF', '#D3E4FD', '#0EA5E9', '#8B5CF6', '#D946EF', '#F97316', '#FEC6A1', '#FDE1D3']
  },
  {
    id: 'flookey-1',
    label: 'Flookey Forest',
    colors: ['#F2FCE2', '#D6BCFA', '#6E59A5', '#7E69AB', '#9b87f5', '#F2FCE2', '#FEF7CD', '#FEC6A1']
  },
  {
    id: 'flookey-2',
    label: 'Flookey Ocean',
    colors: ['#D3E4FD', '#0EA5E9', '#33C3F0', '#1EAEDB', '#0FA0CE', '#8B5CF6', '#D946EF', '#E5DEFF']
  },
  {
    id: 'flookey-3',
    label: 'Flookey Sunset',
    colors: ['#FDE1D3', '#FEC6A1', '#F97316', '#D946EF', '#8B5CF6', '#E5DEFF', '#D3E4FD', '#0EA5E9']
  }
];

const ThemeSettings = () => {
  const { theme } = useTheme();
  const { setPendingTheme } = useSettings();

  const handleThemeChange = (value: string) => {
    setPendingTheme(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Themes</h3>
      <RadioGroup 
        defaultValue={theme} 
        onValueChange={handleThemeChange}
        className="space-y-4"
      >
        {THEME_OPTIONS.map((themeOption) => (
          <TooltipProvider key={themeOption.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer">
                  <RadioGroupItem value={themeOption.id} id={themeOption.id} />
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={themeOption.id}>{themeOption.label}</Label>
                    <div className="flex">
                      {themeOption.colors.map((color, index) => (
                        <div
                          key={`${themeOption.id}-${index}`}
                          className="w-4 h-4 border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{themeOption.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ThemeSettings;