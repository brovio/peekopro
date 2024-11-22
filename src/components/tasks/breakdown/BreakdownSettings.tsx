import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface BreakdownSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BreakdownSettings = ({ open, onOpenChange }: BreakdownSettingsProps) => {
  const [settings, setSettings] = useState({
    quickBreakdown: {
      model: "gpt-4o-mini",
      prompt: "Break down this task into clear, actionable steps:",
      guidelines: "- Keep steps concise\n- Make steps actionable\n- Include any prerequisites",
    },
    guidedBreakdown: {
      model: "gpt-4o",
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
    // Save settings to local storage
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
                <Label>Model</Label>
                <Input
                  value={settings.quickBreakdown.model}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    quickBreakdown: { ...prev.quickBreakdown, model: e.target.value }
                  }))}
                />
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
                <Label>Model</Label>
                <Input
                  value={settings.guidedBreakdown.model}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    guidedBreakdown: { ...prev.guidedBreakdown, model: e.target.value }
                  }))}
                />
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