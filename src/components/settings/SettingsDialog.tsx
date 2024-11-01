import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ThemeSettings from "./ThemeSettings";
import CategorySettings from "./CategorySettings";
import DisplaySettings from "./DisplaySettings";

const SettingsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-gray-700" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="theme" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
          </TabsList>
          <TabsContent value="theme" className="mt-4">
            <ThemeSettings />
          </TabsContent>
          <TabsContent value="categories" className="mt-4">
            <CategorySettings />
          </TabsContent>
          <TabsContent value="display" className="mt-4">
            <DisplaySettings />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;