import { Checkbox } from "@/components/ui/checkbox";
import { styleOptions } from "./StyleOptionsData";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StyleOptionsProps {
  selectedStyles: string[];
  onStyleChange: (styles: string[]) => void;
}

const StyleOptions = ({ selectedStyles, onStyleChange }: StyleOptionsProps) => {
  return (
    <div className="bg-card/50 p-4 rounded-lg">
      <label className="block text-sm font-medium mb-3">Style Options</label>
      <ScrollArea className="h-[200px] pr-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {styleOptions.map((style) => (
            <div
              key={style.id}
              className="flex items-center space-x-2 bg-card/50 p-2 rounded-lg hover:bg-card/80 transition-colors"
            >
              <Checkbox
                id={style.id}
                checked={selectedStyles.includes(style.id)}
                onCheckedChange={(checked) => {
                  onStyleChange(
                    checked
                      ? [...selectedStyles, style.id]
                      : selectedStyles.filter((id) => id !== style.id)
                  );
                }}
              />
              <label
                htmlFor={style.id}
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {style.label}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StyleOptions;