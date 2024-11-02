import { Timer, Users, MessageCircle, Home, User2, Lightbulb, AppWindow, Briefcase, Calendar, RefreshCw, AlertTriangle, CheckCircle2, FileText } from "lucide-react";

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Work Day":
      return <Timer className="h-4 w-4 text-gray-300" />;
    case "Delegate":
      return <Users className="h-4 w-4 text-gray-300" />;
    case "Discuss":
      return <MessageCircle className="h-4 w-4 text-gray-300" />;
    case "Family":
      return <Home className="h-4 w-4 text-gray-300" />;
    case "Personal":
      return <User2 className="h-4 w-4 text-gray-300" />;
    case "Ideas":
      return <Lightbulb className="h-4 w-4 text-gray-300" />;
    case "App Ideas":
      return <AppWindow className="h-4 w-4 text-gray-300" />;
    case "Project Ideas":
      return <Briefcase className="h-4 w-4 text-gray-300" />;
    case "Meetings":
      return <Calendar className="h-4 w-4 text-gray-300" />;
    case "Follow-Up":
      return <RefreshCw className="h-4 w-4 text-gray-300" />;
    case "Urgent":
      return <AlertTriangle className="h-4 w-4 text-gray-300" />;
    case "Complete":
      return <CheckCircle2 className="h-4 w-4 text-gray-300" />;
    default:
      return <FileText className="h-4 w-4 text-gray-300" />;
  }
};