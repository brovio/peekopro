import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ProviderModelSelect from "./ProviderModelSelect";
import PromptGuidelinesInput from "./PromptGuidelinesInput";
import { availableModels } from "./BreakdownModels";

interface BreakdownSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BreakdownSettings = ({ open, onOpenChange }: BreakdownSettingsProps) => {
  const [settings, setSettings] = useState({
    quickBreakdown: {
      provider: 'openai',
      model: 'gpt-4',
      prompt: "Break down this task into clear, actionable steps:",
      guidelines: "- Keep steps concise\n- Make steps actionable\n- Include any prerequisites",
    },
    guidedBreakdown: {
      provider: 'openai',
      model: 'gpt-4-turbo-preview',
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
            <ProviderModelSelect
              provider={settings.quickBreakdown.provider}
              model={settings.quickBreakdown.model}
              onProviderChange={(value) => setSettings(prev => ({
                ...prev,
                quickBreakdown: { 
                  ...prev.quickBreakdown, 
                  provider: value,
                  model: availableModels[value as keyof typeof availableModels][0].id
                }
              }))}
              onModelChange={(value) => setSettings(prev => ({
                ...prev,
                quickBreakdown: { ...prev.quickBreakdown, model: value }
              }))}
            />
            
            <PromptGuidelinesInput
              prompt={settings.quickBreakdown.prompt}
              guidelines={settings.quickBreakdown.guidelines}
              onPromptChange={(value) => setSettings(prev => ({
                ...prev,
                quickBreakdown: { ...prev.quickBreakdown, prompt: value }
              }))}
              onGuidelinesChange={(value) => setSettings(prev => ({
                ...prev,
                quickBreakdown: { ...prev.quickBreakdown, guidelines: value }
              }))}
            />
          </TabsContent>
          
          <TabsContent value="guided" className="space-y-4">
            <ProviderModelSelect
              provider={settings.guidedBreakdown.provider}
              model={settings.guidedBreakdown.model}
              onProviderChange={(value) => setSettings(prev => ({
                ...prev,
                guidedBreakdown: { 
                  ...prev.guidedBreakdown, 
                  provider: value,
                  model: availableModels[value as keyof typeof availableModels][0].id
                }
              }))}
              onModelChange={(value) => setSettings(prev => ({
                ...prev,
                guidedBreakdown: { ...prev.guidedBreakdown, model: value }
              }))}
            />
            
            <PromptGuidelinesInput
              prompt={settings.guidedBreakdown.prompt}
              guidelines={settings.guidedBreakdown.guidelines}
              onPromptChange={(value) => setSettings(prev => ({
                ...prev,
                guidedBreakdown: { ...prev.guidedBreakdown, prompt: value }
              }))}
              onGuidelinesChange={(value) => setSettings(prev => ({
                ...prev,
                guidedBreakdown: { ...prev.guidedBreakdown, guidelines: value }
              }))}
            />
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