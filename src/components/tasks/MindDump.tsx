import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, FileText, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClassifyTask } from "@/hooks/useClassifyTask";
import { Task, TaskInput, SubTask } from "@/types/task";
import { Json } from "@/integrations/supabase/types";
import TaskClassificationButtons from "./TaskClassificationButtons";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface MindDumpProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const MindDump = ({ tasks, onTasksChange }: MindDumpProps) => {
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();
  const { classifyTask, isClassifying } = useClassifyTask();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && user) {
      e.preventDefault();
      const content = inputValue.trim();
      if (!content) return;

      const newTask: TaskInput = {
        id: crypto.randomUUID(),
        content,
        category: null,
        confidence: 0,
        subtasks: [] as unknown as Json
      };

      try {
        const { data: savedTask, error } = await supabase
          .from('tasks')
          .insert([{
            content: newTask.content,
            category: newTask.category,
            confidence: newTask.confidence,
            user_id: user.id,
            subtasks: newTask.subtasks
          }])
          .select()
          .single();

        if (error) throw error;

        const updatedTask = {
          ...savedTask,
          subtasks: savedTask.subtasks ? (savedTask.subtasks as unknown as SubTask[]) : []
        } as Task;
        
        onTasksChange([updatedTask, ...tasks]);

        try {
          const classification = await classifyTask(content);
          if (classification.confidence > 0.8) {
            const { error: updateError } = await supabase
              .from('tasks')
              .update({
                category: classification.category.toLowerCase(),
                confidence: classification.confidence
              })
              .eq('id', savedTask.id);

            if (updateError) throw updateError;

            updatedTask.category = classification.category;
            updatedTask.confidence = classification.confidence;
            onTasksChange([updatedTask, ...tasks]);
            
            toast({
              title: "Task added",
              description: `Automatically classified as ${classification.category}`,
            });
          }
        } catch (error) {
          toast({
            title: "Classification failed",
            description: "Task added to Monkey Thoughts",
            variant: "destructive",
          });
        }

        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        
        setInputValue("");
      } catch (error: any) {
        toast({
          title: "Failed to save task",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleManualClassification = async (taskId: string, category: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          category: category.toLowerCase(),
          confidence: 1
        })
        .eq('id', taskId);

      if (error) throw error;

      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, category: category.toLowerCase(), confidence: 1 }
          : task
      );
      onTasksChange(updatedTasks);
      
      toast({
        title: "Task classified",
        description: `Manually classified as ${category}`,
      });

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error: any) {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          placeholder="Empty your monkey mind..."
          className="h-12 bg-[#6a94ff] text-white border-none placeholder:text-white/70 pr-10"
          onKeyDown={handleSubmit}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-100">
          <FileText className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Monkey Thoughts</h2>
        </div>

        <div className="space-y-2">
          {tasks.filter(task => !task.category).map(task => (
            <div
              key={task.id}
              className={cn(
                "flex items-center justify-between py-3 px-4 rounded-md",
                "bg-[#141e38] hover:bg-[#1a2747] border border-gray-700"
              )}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-100">{task.content}</span>
              </div>
              <TaskClassificationButtons 
                taskId={task.id}
                onClassify={handleManualClassification}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MindDump;