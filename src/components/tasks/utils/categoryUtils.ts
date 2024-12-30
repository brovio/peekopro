export const availableCategories = [
  "Work Day", "Delegate", "Discuss", "Family", "Personal",
  "Ideas", "App Ideas", "Project Ideas", "Meetings", "Follow-Up",
  "Urgent", "Complete", "Christmas", "Holiday"
];

export const getCategoryColor = (category: string): { color: string, borderColor: string } => {
  switch (category) {
    case "#1":
      return { color: "bg-[#9b87f5]", borderColor: "border-[#9b87f5]" };
    case "Work Day":
      return { color: "bg-[#0EA5E9]", borderColor: "border-[#0EA5E9]" };
    default:
      return { color: "bg-[#6366F1]", borderColor: "border-[#6366F1]" };
  }
};