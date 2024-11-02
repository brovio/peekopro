import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, FileText, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClassifyTask } from "@/hooks/useClassifyTask";
import { Task } from "@/types/task";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MindDump = () => {
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const { classifyTask } = useClassifyTask();

  const handleSubmit = () => {
    if (!input.trim()) return;
    classifyTask(input)
      .then(() => {
        toast({ description: "Task classified successfully!" });
        setInput("");
      })
      .catch(() => {
        toast({ description: "Error classifying task." });
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="rounded-lg border bg-[#6a94ff] p-4 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-100">
          <FileText className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Monkey Thoughts</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 cursor-help opacity-70 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Empty your monkey mind here. All tasks will be automatically classified.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind?"
            className="bg-white/10 text-white placeholder:text-white/50"
          />
          <button
            onClick={handleSubmit}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20",
              !input.trim() && "cursor-not-allowed opacity-50"
            )}
            disabled={!input.trim()}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MindDump;
