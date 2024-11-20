import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileUploadInput } from "@/components/ui/file-upload";
import { Checkbox } from "@/components/ui/checkbox";

interface QuestionItemProps {
  question: {
    text: string;
    type: 'text' | 'radio' | 'checkbox' | 'file';
    options?: string[];
  };
  index: number;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

const QuestionItem = ({ question, index, value, onChange }: QuestionItemProps) => {
  const cleanText = question.text.replace(/^\[|\]$/g, '').trim();

  return (
    <div className="space-y-2 bg-navy-800/50 p-4 rounded-lg border border-gray-800/50">
      <Label className="text-gray-200 flex-1">
        {cleanText}
        <span className="text-xs text-gray-400 ml-2">(optional)</span>
      </Label>

      {question.type === 'radio' && question.options && (
        <RadioGroup
          onValueChange={onChange}
          value={value as string}
          className="space-y-2"
        >
          {question.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${index}-${option}`} className="border-gray-600" />
              <Label htmlFor={`${index}-${option}`} className="text-gray-300">{option}</Label>
            </div>
          ))}
        </RadioGroup>
      )}
      
      {question.type === 'checkbox' && question.options && (
        <div className="space-y-2">
          {question.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${index}-${option}`}
                checked={(value as string[])?.includes(option)}
                onCheckedChange={(checked) => {
                  const currentValues = Array.isArray(value) ? value : [];
                  const newValues = checked
                    ? [...currentValues, option]
                    : currentValues.filter(v => v !== option);
                  onChange(newValues);
                }}
                className="border-gray-600"
              />
              <Label htmlFor={`${index}-${option}`} className="text-gray-300">{option}</Label>
            </div>
          ))}
        </div>
      )}
      
      {question.type === 'text' && (
        <Input
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="bg-navy-800 border-gray-700 text-gray-100"
          placeholder="Your answer (optional)"
        />
      )}
      
      {question.type === 'file' && (
        <FileUploadInput
          onFileUpload={(url) => onChange(url)}
        />
      )}
    </div>
  );
};

export default QuestionItem;