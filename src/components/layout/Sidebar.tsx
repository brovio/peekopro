import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ListTodo, Users, Lightbulb, AppWindow } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: ListTodo, label: "Tasks", path: "/tasks" },
  { icon: Users, label: "Delegation", path: "/delegation" },
  { icon: Lightbulb, label: "Project Ideas", path: "/projects" },
  { icon: AppWindow, label: "App Ideas", path: "/apps" },
];

interface SidebarProps {
  onShowApiKeys?: (show: boolean) => void;
}

const Sidebar = ({ onShowApiKeys }: SidebarProps) => {
  const location = useLocation();
  const [clickCount, setClickCount] = useState(0);
  const [secretSequence, setSecretSequence] = useState("");
  const [showP, setShowP] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    return () => clearTimeout(timer);
  }, [clickCount]);

  useEffect(() => {
    if (clickCount === 3) {
      const handleKeyPress = (e: KeyboardEvent) => {
        setSecretSequence(prev => {
          const newSequence = prev + e.key.toLowerCase();
          if (newSequence === "peeko") {
            setShowP(true);
          }
          return newSequence;
        });
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    } else {
      setSecretSequence("");
      setShowP(false);
    }
  }, [clickCount]);

  const handleSidebarClick = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setClickCount(prev => prev + 1);
    }
  };

  const handleVersionClick = () => {
    if (showP) {
      onShowApiKeys?.(true);
    }
  };

  return (
    <div 
      className="w-64 h-screen bg-sidebar-background border-r border-border flex flex-col py-6 px-3"
      onMouseDown={handleSidebarClick}
    >
      <div className="mb-8 px-3">
        <h1 className="text-xl font-semibold text-foreground">Productivity Hub</h1>
      </div>
      
      <nav className="flex-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md mb-1 text-muted-foreground hover:bg-sidebar-hover transition-colors",
              location.pathname === path && "bg-sidebar-active font-medium text-foreground"
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="px-3 py-4 mt-auto">
        <div 
          className="text-sm text-muted-foreground cursor-pointer"
          onClick={handleVersionClick}
        >
          {showP ? "Persion 1.1.0" : "Version 1.1.0"}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;