import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MindDump from "@/components/tasks/MindDump";
import TaskTestList from "@/components/tasks/test/TaskTestList";
import { AITestSection } from "@/components/test/AITestSection";
import { useTestTasks } from "@/hooks/useTestTasks";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createTask } from "@/services/taskService";
import { useAuth } from "@/contexts/AuthContext";

const Flow = () => {
  const { tasks, updateTask, deleteTask, moveTask, handleTasksChange } = useTestTasks();
  const [mindInput, setMindInput] = useState("");
  const [classifyInput, setClassifyInput] = useState("");
  const aiInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDump = async () => {
    if (!mindInput.trim() || !user) return;
    
    try {
      await createTask(mindInput.trim(), user.id);
      handleTasksChange();
      setMindInput("");
      toast({
        title: "Success",
        description: "Thought dumped successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dump thought",
        variant: "destructive",
      });
    }
  };

  const handleClassify = async (category: string) => {
    if (!classifyInput.trim() || !user) return;
    
    try {
      // Create task with category in the content
      await createTask(`[${category}] ${classifyInput.trim()}`, user.id);
      handleTasksChange();
      setClassifyInput("");
      
      if (category.toLowerCase() === "work" && aiInputRef.current) {
        aiInputRef.current.value = classifyInput;
      }
      
      toast({
        title: "Success",
        description: `Task classified as ${category}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to classify task",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="p-6 bg-card">
        <h1 className="text-2xl font-bold mb-6">Flow</h1>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="What's on your mind?"
                value={mindInput}
                onChange={(e) => setMindInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleDump}>
                Dump
              </Button>
            </div>

            <div className="flex gap-4">
              <Input
                placeholder="Classify..."
                value={classifyInput}
                onChange={(e) => setClassifyInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => handleClassify("Work")}>Work</Button>
              <Button onClick={() => handleClassify("Bump")}>Bump</Button>
              <Button onClick={() => handleClassify("Peeko")}>Peeko</Button>
              <Button onClick={() => handleClassify("Family")}>Family</Button>
            </div>
          </div>
          
          <MindDump 
            tasks={tasks} 
            onTasksChange={handleTasksChange}
          />

          <TaskTestList
            tasks={tasks}
            onTaskUpdate={updateTask}
            onTaskDelete={deleteTask}
            onTaskMove={moveTask}
          />
        </div>
      </Card>

      <Card className="p-6 bg-card">
        <h2 className="text-xl font-bold mb-6">AI Task Breakdown Testing</h2>
        <AITestSection ref={aiInputRef} />
      </Card>
    </div>
  );
};

export default Flow;