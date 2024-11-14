import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, FileText, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClassifyTask } from "@/hooks/useClassifyTask";
import { Task, TaskInput, SubTask } from "@/types/task";
import { Json } from "@/integrations/supabase/types";
import TaskClassificationButtons from "./TaskClassificationButtons";
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

      try {
        // Create the task object
        const newTask: TaskInput = {
          content,
          category: null,
          confidence: 0,
          subtasks: [] as unknown as Json,
          user_id: user.id
        };

        // Insert the task and get the ID back
        const { data, error } = await supabase
          .from('tasks')
          .insert(newTask)
          .select('id')
          .single();

        if (error) throw error;
        if (!data) throw new Error('No task ID returned after insertion');

        // Fetch the complete task data
        const { data: taskData, error: fetchError } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', data.id)
          .single();

        if (fetchError) throw fetchError;
        if (!taskData) throw new Error('Could not fetch the created task');

        // Create the complete task object
        const completedTask = {
          ...taskData,
          subtasks: taskData.subtasks ? (taskData.subtasks as unknown as SubTask[]) : []
        } as Task;
        
        // Update local state
        onTasksChange([completedTask, ...tasks]);
        setInputValue("");

        // Try to classify the task
        try {
          const classification = await classifyTask(content);
          if (classification.confidence > 0.8) {
            const { error: updateError } = await supabase
              .from('tasks')
              .update({
                category: classification.category.toLowerCase(),
                confidence: classification.confidence
              })
              .eq('id', completedTask.id);

            if (updateError) throw updateError;

            completedTask.category = classification.category;
            completedTask.confidence = classification.confidence;
            onTasksChange([completedTask, ...tasks.filter(t => t.id !== completedTask.id)]);
            
            toast({
              title: "Task added",
              description: `Automatically classified as ${classification.category}`,
            });
          }
        } catch (error) {
          console.error('Classification error:', error);
          toast({
            title: "Classification failed",
            description: "Task added to Monkey Thoughts",
            variant: "destructive",
          });
        }

        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      } catch (error: any) {
        console.error('Task creation error:', error);
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

  // Filter tasks to show only uncategorized ones (Monkey Thoughts)
  const monkeyThoughts = tasks.filter(task => !task.category || task.category === null);

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
          <span className="text-sm text-gray-400">({monkeyThoughts.length})</span>
        </div>

        <div className="space-y-2">
          {monkeyThoughts.map(task => (
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