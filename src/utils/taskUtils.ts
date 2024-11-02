import { SubTask } from "@/types/task";

export async function generateSubtasksForTask(taskContent: string): Promise<SubTask[]> {
  // This is a mock implementation that generates subtasks based on the task content
  // In a real implementation, this would call an AI service
  
  const commonSubtasks = [
    "Research and gather information",
    "Create initial draft/plan",
    "Review and refine",
    "Implement/Execute",
    "Test and validate",
    "Finalize and document"
  ];

  // Generate 3-4 relevant subtasks based on the task content
  const numSubtasks = Math.floor(Math.random() * 2) + 3; // 3-4 subtasks
  const selectedSubtasks = commonSubtasks
    .slice(0, numSubtasks)
    .map(content => ({
      id: crypto.randomUUID(),
      content: `${content} for "${taskContent}"`,
      completed: false
    }));

  return selectedSubtasks;
}