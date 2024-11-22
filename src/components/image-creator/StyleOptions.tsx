import { Checkbox } from "@/components/ui/checkbox";
import { styleOptions } from "./StyleOptionsData";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StyleOptionsProps {
  selectedStyles: string[];
  onStyleChange: (styles: string[]) => void;
}

const StyleOptions = ({ selectedStyles, onStyleChange }: StyleOptionsProps) => {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <label className="block text-lg font-medium mb-4">Style Options</label>
      <ScrollArea className="h-[300px] pr-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {styleOptions.map((style) => (
            <div
              key={style.id}
              className="flex items-center space-x-2 bg-background/50 p-3 rounded-lg hover:bg-background/80 transition-colors"
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
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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