import { LucideIcon, Trophy, Briefcase, Dumbbell, Repeat, BookOpen, FileText } from "lucide-react";

export const getCategoryIcon = (category: string): LucideIcon => {
  switch (category) {
    case "#1":
      return Trophy;
    case "Work":
      return Briefcase;
    case "Fitness":
      return Dumbbell;
    case "Habit":
      return Repeat;
    case "Journal":
      return BookOpen;
    default:
      return FileText;
  }
};

export const getCategoryColor = (category: string): { bg: string; border: string } => {
  switch (category) {
    case "#1":
      return { bg: "bg-[#9b87f5]", border: "border-[#9b87f5]" };
    case "Work":
      return { bg: "bg-[#0EA5E9]", border: "border-[#0EA5E9]" };
    case "Fitness":
    case "Habit":
    case "Journal":
      return { bg: "bg-[#F97316]", border: "border-[#F97316]" };
    default:
      return { bg: "bg-[#6366F1]", border: "border-[#6366F1]" };
  }
};

export const isDefaultCategory = (category: string): boolean => {
  return ["#1", "Work", "Fitness", "Habit", "Journal", "Complete"].includes(category);
};