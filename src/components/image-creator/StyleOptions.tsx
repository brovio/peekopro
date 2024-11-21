import { Checkbox } from "@/components/ui/checkbox";

export const styleOptions = [
  { id: 'abstract', label: 'Abstract Art' },
  { id: 'ad', label: 'Advertisement' },
  { id: 'website', label: 'Website Photos' },
  { id: 'background', label: 'Background Images' },
  { id: 'warm', label: 'Warm Tones' },
  { id: 'cold', label: 'Cold Tones' },
  { id: 'bw', label: 'Black and White' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'futuristic', label: 'Futuristic' },
  { id: 'nature', label: 'Nature-inspired' },
  { id: 'geometric', label: 'Geometric' }
];

interface StyleOptionsProps {
  selectedStyles: string[];
  onStyleChange: (styles: string[]) => void;
}

const StyleOptions = ({ selectedStyles, onStyleChange }: StyleOptionsProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Style Options</label>
      <div className="grid grid-cols-2 gap-4">
        {styleOptions.map((style) => (
          <div key={style.id} className="flex items-center space-x-2">
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
            <label htmlFor={style.id} className="text-sm">
              {style.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StyleOptions;