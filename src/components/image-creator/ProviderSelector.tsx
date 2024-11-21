import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const providers = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    models: [
      { id: 'dall-e-3', name: 'DALL-E 3', cost: '$0.040' }
    ]
  },
  { 
    id: 'fal', 
    name: 'Fal.ai', 
    models: [
      { id: 'fast-sdxl', name: 'Fast SDXL', cost: '$0.005' },
      { id: 'flux1.1pro', name: 'FLUX 1.1 Pro', cost: '$0.008' },
      { id: 'lcm', name: 'LCM', cost: '$0.003' }
    ]
  },
  { 
    id: 'openrouter', 
    name: 'OpenRouter', 
    models: [
      { id: 'sdxl', name: 'Stable Diffusion XL', cost: '$0.008' },
      { id: 'playground-v2', name: 'Playground v2', cost: '$0.008' },
      { id: 'kandinsky-2.2', name: 'Kandinsky 2.2', cost: '$0.007' },
      { id: 'dall-e-3', name: 'DALL-E 3 (via OpenRouter)', cost: '$0.040' }
    ]
  },
];

interface ProviderSelectorProps {
  provider: string;
  model: string;
  onProviderChange: (value: string) => void;
  onModelChange: (value: string) => void;
}

const ProviderSelector = ({
  provider,
  model,
  onProviderChange,
  onModelChange,
}: ProviderSelectorProps) => {
  const selectedProvider = providers.find(p => p.id === provider);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Provider</label>
        <Select onValueChange={onProviderChange} value={provider}>
          <SelectTrigger>
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {provider && (
        <div>
          <label className="block text-sm font-medium mb-2">Model</label>
          <Select onValueChange={onModelChange} value={model}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {selectedProvider?.models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name} ({m.cost})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ProviderSelector;