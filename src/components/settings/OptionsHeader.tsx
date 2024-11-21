import { Button } from "@/components/ui/button";
import { Save, Check, X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";

interface OptionsHeaderProps {
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onPreviewToast: () => void;
}

const OptionsHeader = ({ hasUnsavedChanges, onSave, onPreviewToast }: OptionsHeaderProps) => {
  const navigate = useNavigate();

  const handleSaveAndNavigate = () => {
    onSave();
    navigate('/');
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      toast({
        title: "Changes discarded",
        description: "Your changes have not been saved",
      });
    }
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Options</h1>
      <TooltipProvider>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onPreviewToast}
                className="hover:bg-secondary"
              >
                <Eye className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview toast notification</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveAndNavigate}
                className="hover:bg-secondary"
              >
                <Save className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save and return home</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSave}
                className="hover:bg-secondary"
              >
                <Check className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Apply changes</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cancel and return home</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default OptionsHeader;