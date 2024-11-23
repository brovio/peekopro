import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PromptGuidelinesInputProps {
  prompt: string;
  guidelines: string;
  onPromptChange: (value: string) => void;
  onGuidelinesChange: (value: string) => void;
}

const PromptGuidelinesInput = ({
  prompt,
  guidelines,
  onPromptChange,
  onGuidelinesChange,
}: PromptGuidelinesInputProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>System Prompt</Label>
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Guidelines</Label>
        <Textarea
          value={guidelines}
          onChange={(e) => onGuidelinesChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PromptGuidelinesInput;