import { SubTask } from "@/types/task";

const mockGPTResponse = (taskContent: string): string[] => {
  // This is a mock implementation - in a real app, this would call the OpenAI API
  const content = taskContent.toLowerCase();
  
  if (content.includes("research")) {
    return [
      "Review existing literature and resources",
      "Identify key areas of focus",
      "Compile findings into a document",
      "Create summary and recommendations"
    ];
  } else if (content.includes("meeting")) {
    return [
      "Prepare agenda",
      "Send calendar invites",
      "Gather required materials",
      "Take meeting notes",
      "Follow up with action items"
    ];
  } else if (content.includes("develop") || content.includes("build")) {
    return [
      "Create technical specification",
      "Set up development environment",
      "Implement core functionality",
      "Write tests",
      "Perform code review"
    ];
  }
  
  // Default subtasks for any other type of task
  return [
    "Plan and outline approach",
    "Execute main task components",
    "Review and validate work",
    "Document completion and next steps"
  ];
};

export const generateAISubtasks = (taskContent: string): SubTask[] => {
  const subtaskContents = mockGPTResponse(taskContent);
  return subtaskContents.map(content => ({
    id: crypto.randomUUID(),
    content,
    completed: false
  }));
};