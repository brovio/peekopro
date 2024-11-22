import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface BreakdownSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableModels = {
  openai: [
    { id: 'gpt-4o', name: 'GPT-4 Optimized' },
    { id: 'gpt-4o-mini', name: 'GPT-4 Mini' }
  ],
  anthropic: [
    { id: 'claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku' }
  ],
  openrouter: [
    { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
    { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'google/gemini-pro', name: 'Gemini Pro' },
    { id: 'meta-llama/llama-2-70b-chat', name: 'Llama 2 70B' }
  ],
  fal: [
    { id: 'fast-sdxl', name: 'Fast SDXL' },
    { id: 'flux1.1pro', name: 'FLUX 1.1 Pro' },
    { id: 'lcm', name: 'LCM' }
  ],
  google: [
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' }
  ],
  groq: [
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
    { id: 'llama2-70b-4096', name: 'Llama 2 70B' }
  ]
};

const BreakdownSettings = ({ open, onOpenChange }: BreakdownSettingsProps) => {
  const [settings, setSettings] = useState({
    quickBreakdown: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      prompt: "Break down this task into clear, actionable steps:",
      guidelines: "- Keep steps concise\n- Make steps actionable\n- Include any prerequisites",
    },
    guidedBreakdown: {
      provider: 'openai',
      model: 'gpt-4o',
      prompt: "Help me break down this task by asking relevant questions:",
      guidelines: "- Ask clarifying questions\n- Consider dependencies\n- Focus on implementation details",
    },
    general: {
      autoSave: true,
      showEstimates: false,
      useTemplates: true,
    }
  });
  
  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem('breakdown-settings', JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your breakdown preferences have been updated",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Breakdown Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="quick">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick">Quick Breakdown</TabsTrigger>
            <TabsTrigger value="guided">Guided Breakdown</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select
                  value={settings.quickBreakdown.provider}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    quickBreakdown: { ...prev.quickBreakdown, provider: value, model: availableModels[value][0].id }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(availableModels).map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider.charAt(0).toUpperCase() + provider.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Model</Label>
                <Select
                  value={settings.quickBreakdown.model}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    quickBreakdown: { ...prev.quickBreakdown, model: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels[settings.quickBreakdown.provider].map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>System Prompt</Label>
                <Textarea
                  value={settings.quickBreakdown.prompt}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    quickBreakdown: { ...prev.quickBreakdown, prompt: e.target.value }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Guidelines</Label>
                <Textarea
                  value={settings.quickBreakdown.guidelines}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    quickBreakdown: { ...prev.quickBreakdown, guidelines: e.target.value }
                  }))}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="guided" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select
                  value={settings.guidedBreakdown.provider}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    guidedBreakdown: { ...prev.guidedBreakdown, provider: value, model: availableModels[value][0].id }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(availableModels).map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider.charAt(0).toUpperCase() + provider.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Model</Label>
                <Select
                  value={settings.guidedBreakdown.model}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    guidedBreakdown: { ...prev.guidedBreakdown, model: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels[settings.guidedBreakdown.provider].map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>System Prompt</Label>
                <Textarea
                  value={settings.guidedBreakdown.prompt}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    guidedBreakdown: { ...prev.guidedBreakdown, prompt: e.target.value }
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Guidelines</Label>
                <Textarea
                  value={settings.guidedBreakdown.guidelines}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    guidedBreakdown: { ...prev.guidedBreakdown, guidelines: e.target.value }
                  }))}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">Auto-save breakdowns</Label>
                <Switch
                  id="auto-save"
                  checked={settings.general.autoSave}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, autoSave: checked }
                  }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-estimates">Show time estimates</Label>
                <Switch
                  id="show-estimates"
                  checked={settings.general.showEstimates}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, showEstimates: checked }
                  }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="use-templates">Enable templates</Label>
                <Switch
                  id="use-templates"
                  checked={settings.general.useTemplates}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, useTemplates: checked }
                  }))}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BreakdownSettings;