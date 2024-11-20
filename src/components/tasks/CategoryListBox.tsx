import { Task } from "@/types/task";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SubTask {
  id: string;
  content: string;
  completed: boolean;
}

interface CategoryListBoxProps {
  task: Task;
  onSelect: (category: string) => void;
}

export function CategoryListBox({ task, onSelect }: CategoryListBoxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleUpdateTask = async (category: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          category,
          subtasks: (task.subtasks || []) as SubTask[],
        })
        .eq('id', task.id);

      if (error) throw error;
      
      onSelect(category);
      setValue(category);
      setOpen(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-between", !value && "text-muted-foreground")}>
          {value ? value : "Select a category"}
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandEmpty>No categories found.</CommandEmpty>
          <CommandGroup>
            <CommandItem onSelect={() => handleUpdateTask("Work Day")}>Work Day</CommandItem>
            <CommandItem onSelect={() => handleUpdateTask("Delegate")}>Delegate</CommandItem>
            <CommandItem onSelect={() => handleUpdateTask("Discuss")}>Discuss</CommandItem>
            <CommandItem onSelect={() => handleUpdateTask("Family")}>Family</CommandItem>
            <CommandItem onSelect={() => handleUpdateTask("Personal")}>Personal</CommandItem>
            <CommandItem onSelect={() => handleUpdateTask("Ideas")}>Ideas</CommandItem>
            <CommandItem onSelect={() => handleUpdateTask("App Ideas")}>App Ideas</CommandItem>
            <CommandItem onSelect={() => handleUpdateTask("Project Ideas")}>Project Ideas</CommandItem>
            <CommandItem onSelect={() => handleUpdateTask("Meetings")}>Meetings</CommandItem>
            <CommandItem onSelect={() => handleUpdateTask("Follow-Up")}>Follow-Up</CommandItem>
            <CommandItem onSelect={() => handleUpdateTask("Urgent")}>Urgent</CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
