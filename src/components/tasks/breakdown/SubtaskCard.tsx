import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface SubtaskCardProps {
  subtask: string;
  index: number;
}

const pastelColors = [
  { bg: "bg-[#F2FCE2]", text: "text-gray-800" },  // Soft Green
  { bg: "bg-[#FEF7CD]", text: "text-gray-800" },  // Soft Yellow
  { bg: "bg-[#FEC6A1]", text: "text-gray-800" },  // Soft Orange
  { bg: "bg-[#E5DEFF]", text: "text-gray-800" },  // Soft Purple
  { bg: "bg-[#FFDEE2]", text: "text-gray-800" },  // Soft Pink
  { bg: "bg-[#FDE1D3]", text: "text-gray-800" },  // Soft Peach
  { bg: "bg-[#D3E4FD]", text: "text-gray-800" },  // Soft Blue
];

const SubtaskCard = ({ subtask, index }: SubtaskCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const colorIndex = index % pastelColors.length;
  const { bg, text } = pastelColors[colorIndex];
  
  // Estimate time based on subtask length and complexity
  const estimatedTime = Math.max(5, Math.ceil(subtask.length / 50)) + " minutes";
  
  // Create a preview of the subtask
  const preview = subtask.length > 100 ? subtask.slice(0, 100) + "..." : subtask;

  // Break down the subtask into smaller steps
  const detailedSteps = subtask
    .split(/[.!?]/)
    .filter(step => step.trim().length > 0)
    .map(step => step.trim());

  return (
    <>
      <Card 
        className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${bg} border-none shadow-md`}
        onClick={() => setIsOpen(true)}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${text}`}>Subtask {index + 1}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{estimatedTime}</span>
            </div>
          </div>
          <p className={`text-sm ${text}`}>{preview}</p>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Subtask {index + 1} Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Estimated time: {estimatedTime}</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Full Description:</h4>
              <p className="text-gray-700">{subtask}</p>
            </div>
            {detailedSteps.length > 1 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">Detailed Steps:</h4>
                <ul className="space-y-2">
                  {detailedSteps.map((step, i) => (
                    <li key={i} className="flex gap-2 text-gray-700">
                      <span className="font-medium">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubtaskCard;