import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUploadInput } from "@/components/ui/file-upload";
import { useState } from "react";

interface Question {
  text: string;
  type: 'text' | 'radio' | 'file';
  options?: string[];
}

interface TaskQuestionsDialogProps {
  questions: Question[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (answers: Record<string, string>) => void;
}

const TaskQuestionsDialog = ({ questions, open, onOpenChange, onSubmit }: TaskQuestionsDialogProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    onSubmit(answers);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-navy-900 border-navy-800">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Additional Questions</DialogTitle>
          <DialogDescription className="text-gray-400">
            Please answer these questions to help break down the task more effectively.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {questions.map((question, index) => (
            <div key={index} className="space-y-2">
              <Label className="text-gray-200">{question.text}</Label>
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
                />
              )}
              {question.type === 'file' && (
                <FileUploadInput
                  onFileUpload={(url) => setAnswers(prev => ({ ...prev, [index]: url }))}
                  className="bg-navy-800 border-gray-700 text-gray-100"
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Submit Answers
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskQuestionsDialog;