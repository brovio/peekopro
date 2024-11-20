import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import QuestionItem from "./QuestionItem";

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

  // Filter and process questions
  const processedQuestions = questions
    .filter(q => {
      const cleanText = q.text?.replace(/^\[|\]$/g, '').trim();
      return cleanText && !cleanText.match(/^\(optional\)$/i);
    })
    .map(q => {
      const cleanText = q.text.replace(/^\[|\]$/g, '').trim();
      let type = q.type || 'text';
      let options = q.options;

      // Determine question type and options based on content
      if (cleanText.toLowerCase().includes('upload') || 
          cleanText.toLowerCase().includes('attach') ||
          cleanText.toLowerCase().includes('file') ||
          cleanText.toLowerCase().includes('image')) {
        type = 'file';
      } else if (cleanText.toLowerCase().includes('choose') || 
                 cleanText.toLowerCase().includes('select') ||
                 cleanText.toLowerCase().includes('prefer') ||
                 cleanText.toLowerCase().includes('options:')) {
        type = 'radio';
        if (!options) {
          // Extract options from the question text if they're in a list format
          const optionsMatch = cleanText.match(/(?:options:|:)([\s\S]+)/i);
          if (optionsMatch) {
            options = optionsMatch[1]
              .split(/[,\n]/)
              .map(opt => opt.trim())
              .filter(opt => opt.length > 0);
          } else {
            options = ['Option A', 'Option B'];
          }
        }
      }

      return { ...q, text: cleanText, type, options };
    });

  // Remove duplicates
  const uniqueQuestions = processedQuestions.filter((question, index, self) =>
    index === self.findIndex((q) => q.text === question.text)
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
            <QuestionItem
              key={index}
              question={question}
              index={index}
              value={answers[index] || ''}
              onChange={(value) => setAnswers(prev => ({ ...prev, [index]: value }))}
            />
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