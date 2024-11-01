import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ListTodo, Users, Lightbulb, AppWindow } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: ListTodo, label: "Tasks", path: "/tasks" },
  { icon: Users, label: "Delegation", path: "/delegation" },
  { icon: Lightbulb, label: "Project Ideas", path: "/projects" },
  { icon: AppWindow, label: "App Ideas", path: "/apps" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-sidebar-background border-r border-gray-200 flex flex-col py-6 px-3">
      <div className="mb-8 px-3">
        <h1 className="text-xl font-semibold text-gray-800">Productivity Hub</h1>
      </div>
      
      <nav className="flex-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md mb-1 text-gray-700 hover:bg-sidebar-hover transition-colors",
              location.pathname === path && "bg-sidebar-active font-medium"
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="px-3 py-4 mt-auto">
        <div className="text-sm text-gray-500">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;