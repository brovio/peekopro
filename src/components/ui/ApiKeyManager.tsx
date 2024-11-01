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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_KEY_OPTIONS = [
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "GOOGLE_API_KEY",
  "GOOGLE_CLOUD_API_KEY",
  "AZURE_API_KEY",
  "HUGGINGFACE_API_KEY",
  "OPENROUTER_API_KEY",
  "FAL_API_KEY",
] as const;

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
    // Format keys as NAME=VALUE before saving
    const formattedKeys = keys.map(k => ({
      ...k,
      key: k.key.startsWith(k.name + "=") ? k.key : `${k.name}=${k.key}`
    }));
    setApiKeys(formattedKeys);
    localStorage.setItem("_ak", btoa(JSON.stringify(formattedKeys)));
  };

  const addKey = () => {
    const newKeys = [
      ...apiKeys,
      { id: crypto.randomUUID(), name: API_KEY_OPTIONS[0], key: "" },
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>API Key Management</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Key Name</th>
                <th className="text-left p-2">API Key</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} className="border-t">
                  <td className="p-2">
                    <Select
                      value={key.name}
                      onValueChange={(value) => updateKey(key.id, "name", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select key type" />
                      </SelectTrigger>
                      <SelectContent>
                        {API_KEY_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Input
                      type="password"
                      placeholder="Enter API Key"
                      value={key.key.replace(`${key.name}=`, "")}
                      onChange={(e) => updateKey(key.id, "key", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteKey(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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