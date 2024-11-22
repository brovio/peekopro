import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface StepsListProps {
  steps: string[];
}

const StepsList = ({ steps }: StepsListProps) => {
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({});

  const handleStepToggle = (index: number, checked: boolean) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: checked
    }));
  };

  if (!steps.length) return null;

  return (
    <div className="mt-6 space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold text-gray-100">Steps:</h2>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-[#2A2F3C] hover:bg-[#343B4D] transition-colors"
          >
            <Checkbox
              id={`step-${index}`}
              checked={completedSteps[index] || false}
              onCheckedChange={(checked) => handleStepToggle(index, checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor={`step-${index}`}
              className={`flex-1 text-sm ${
                completedSteps[index] ? 'text-gray-400 line-through' : 'text-gray-200'
              }`}
            >
              {index + 1}. {step}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsList;