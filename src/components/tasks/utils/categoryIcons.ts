import { 
  FileText, Timer, Users, MessageCircle, Home, User2, 
  Lightbulb, AppWindow, Briefcase, Calendar, RefreshCw, 
  AlertTriangle, CheckCircle2, FolderPlus, Gift, Palmtree,
  LucideIcon
} from "lucide-react";

export const getCategoryIcon = (category: string): LucideIcon => {
  const defaultCategories: { [key: string]: LucideIcon } = {
    "Work Day": Timer,
    "Delegate": Users,
    "Discuss": MessageCircle,
    "Family": Home,
    "Personal": User2,
    "Ideas": Lightbulb,
    "App Ideas": AppWindow,
    "Project Ideas": Briefcase,
    "Meetings": Calendar,
    "Follow-Up": RefreshCw,
    "Urgent": AlertTriangle,
    "Complete": CheckCircle2,
    "Christmas": Gift,
    "Holiday": Palmtree
  };

  return defaultCategories[category] || FolderPlus;
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "#1":
      return "bg-[#9b87f5] border-[#9b87f5]";
    case "Work":
      return "bg-[#0EA5E9] border-[#0EA5E9]";
    case "Fitness":
    case "Habit":
    case "Journal":
      return "bg-[#F97316] border-[#F97316]";
    default:
      return "bg-[#6366F1] border-[#6366F1]";
  }
};