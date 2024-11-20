import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUploadInput } from "@/components/ui/file-upload";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

interface Question {
  text: string;
  type: 'text' | 'radio' | 'file';
  options?: string[];
  required?: boolean;
}

interface TaskQuestionsDialogProps {
  questions: Question[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (answers: Record<string, string>) => void;
}

const TaskQuestionsDialog = ({ questions, open, onOpenChange, onSubmit }: TaskQuestionsDialogProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSkipping, setIsSkipping] = useState(false);

  const handleSubmit = () => {
    onSubmit(answers);
    onOpenChange(false);
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    onSubmit({});
    onOpenChange(false);
    setIsSkipping(false);
  };

  // Filter out invalid questions (those that are empty or just contain "optional")
  const validQuestions = questions.filter(q => {
    const cleanText = q.text?.replace(/^\[|\]$/g, '').trim();
    return cleanText && !cleanText.match(/^\(optional\)$/i);
  });

  // Remove duplicates based on cleaned question text
  const uniqueQuestions = validQuestions.filter((question, index, self) =>
    index === self.findIndex((q) => 
      q.text.replace(/^\[|\]$/g, '').trim() === question.text.replace(/^\[|\]$/g, '').trim()
    )
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col bg-navy-900 border-navy-800">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Additional Questions</DialogTitle>
          <DialogDescription className="text-gray-400">
            Please answer these questions to help break down the task more effectively. All fields are optional.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 py-4 px-2">
          {uniqueQuestions.map((question, index) => (
            <div 
              key={index} 
              className="space-y-2 bg-navy-800/50 p-4 rounded-lg border border-gray-800/50"
            >
              <div className="flex items-start justify-between gap-2">
                <Label className="text-gray-200 flex-1">
                  {question.text.replace(/^\[|\]$/g, '').trim()}
                  <span className="text-xs text-gray-400 ml-2">(optional)</span>
                </Label>
              </div>
              
              {question.type === 'radio' && question.options && (
                <RadioGroup
                  onValueChange={(value) => setAnswers(prev => ({ ...prev, [index]: value }))}
                  value={answers[index]}
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
              {question.type === 'text' && (
                <Input
                  value={answers[index] || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [index]: e.target.value }))}
                  className="bg-navy-800 border-gray-700 text-gray-100"
                  placeholder="Your answer (optional)"
                />
              )}
              {question.type === 'file' && (
                <FileUploadInput
                  onFileUpload={(url) => setAnswers(prev => ({ ...prev, [index]: url }))}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="sm:justify-between gap-2 border-t border-navy-800 pt-4">
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={isSkipping}
            className="w-full sm:w-auto border-gray-700 hover:bg-navy-800 text-gray-300"
          >
            {isSkipping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Skip & Let AI Try"
            )}
          </Button>
          <Button 
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Submit Answers
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskQuestionsDialog;