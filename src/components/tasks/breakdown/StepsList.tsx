import SubtaskCard from "./SubtaskCard";

interface StepsListProps {
  steps: string[];
}

const StepsList = ({ steps }: StepsListProps) => {
  if (!steps.length) return null;

  return (
    <div className="mt-6 space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold text-gray-100">Steps:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <SubtaskCard
            key={index}
            subtask={step}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default StepsList;