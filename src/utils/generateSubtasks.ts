import { SubTask } from "@/types/task";

const projectSubtasks = [
  "Research and planning phase",
  "Create project timeline",
  "Define requirements",
  "Implementation phase",
  "Testing and QA",
  "Review and feedback",
  "Final adjustments",
];

const meetingSubtasks = [
  "Prepare agenda",
  "Send calendar invites",
  "Gather required materials",
  "Take meeting notes",
  "Follow up with attendees",
];

const researchSubtasks = [
  "Define research scope",
  "Gather initial data",
  "Analyze findings",
  "Document results",
  "Present conclusions",
];

const defaultSubtasks = [
  "Plan approach",
  "Execute main task",
  "Review results",
  "Make adjustments",
];

export const generateSubtasks = (taskName: string): SubTask[] => {
  const lowerTaskName = taskName.toLowerCase();
  let baseSubtasks: string[] = [];

  if (lowerTaskName.includes("project") || lowerTaskName.includes("build") || lowerTaskName.includes("create")) {
    baseSubtasks = projectSubtasks;
  } else if (lowerTaskName.includes("meeting") || lowerTaskName.includes("call") || lowerTaskName.includes("discuss")) {
    baseSubtasks = meetingSubtasks;
  } else if (lowerTaskName.includes("research") || lowerTaskName.includes("study") || lowerTaskName.includes("analyze")) {
    baseSubtasks = researchSubtasks;
  } else {
    baseSubtasks = defaultSubtasks;
  }

  return baseSubtasks.map(content => ({
    id: crypto.randomUUID(),
    content,
    completed: false
  }));
};