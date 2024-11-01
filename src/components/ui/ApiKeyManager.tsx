import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ApiKey {
  id: string;
  name: string;
  key: string;
}

const ApiKeyManager = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedKeys = localStorage.getItem("_ak");
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(atob(savedKeys)));
      } catch (e) {
        console.error("Failed to load keys");
      }
    }
  }, []);

  const saveKeys = (keys: ApiKey[]) => {
    setApiKeys(keys);
    localStorage.setItem("_ak", btoa(JSON.stringify(keys)));
  };

  const addKey = () => {
    const newKeys = [
      ...apiKeys,
      { id: crypto.randomUUID(), name: "", key: "" },
    ];
    saveKeys(newKeys);
  };

  const updateKey = (id: string, field: "name" | "key", value: string) => {
    const newKeys = apiKeys.map((k) =>
      k.id === id ? { ...k, [field]: value } : k
    );
    saveKeys(newKeys);
  };

  const deleteKey = (id: string) => {
    const newKeys = apiKeys.filter((k) => k.id !== id);
    saveKeys(newKeys);
    toast({
      title: "API Key Deleted",
      description: "The API key has been removed successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Key Management</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {apiKeys.map((key) => (
            <div key={key.id} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Key Name"
                  value={key.name}
                  onChange={(e) => updateKey(key.id, "name", e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteKey(key.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                type="password"
                placeholder="API Key"
                value={key.key}
                onChange={(e) => updateKey(key.id, "key", e.target.value)}
              />
            </div>
          ))}
          <Button onClick={addKey} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New API Key
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyManager;