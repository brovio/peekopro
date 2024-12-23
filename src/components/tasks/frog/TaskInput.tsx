import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface TaskInputProps {
  onTaskAdded: () => void;
}

const TaskInput = ({ onTaskAdded }: TaskInputProps) => {
  const [frogTask, setFrogTask] = useState("");
  const [placeholder, setPlaceholder] = useState("Monkey Minding Much?");
  const frogInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleFrogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frogTask.trim() || !user?.id) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          content: frogTask,
          category: "Uncategorized",
          user_id: user.id
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['frog-tasks'] });
      setFrogTask("");
      onTaskAdded();
      
      if (frogInputRef.current) {
        frogInputRef.current.focus();
      }

      toast({
        title: "Task added",
        description: "New task has been created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleFrogSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Input
          ref={frogInputRef}
          placeholder={placeholder}
          value={frogTask}
          onChange={(e) => setFrogTask(e.target.value)}
          className="flex-1 bg-[#2A2F3C] border-gray-700 text-gray-100"
        />
        <Button 
          type="submit"
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
        >
          Dump
        </Button>
      </div>
    </form>
  );
};

export default TaskInput;