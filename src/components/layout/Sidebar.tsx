import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ListTodo, Users, Lightbulb, AppWindow, TestTube2, Flow } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: ListTodo, label: "Tasks", path: "/tasks" },
  { icon: Users, label: "Delegation", path: "/delegation" },
  { icon: Lightbulb, label: "Project Ideas", path: "/projects" },
  { icon: AppWindow, label: "App Ideas", path: "/apps" },
  { icon: Flow, label: "Flow", path: "/flow" },
];

const Sidebar = ({ onShowApiManager }: { onShowApiManager: () => void }) => {
  const location = useLocation();
  const [clicks, setClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [buffer, setBuffer] = useState("");
  const [bufferTimeout, setBufferTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSidebarClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime < 500) {
      setClicks(prev => prev + 1);
      if (clicks === 1) {
        // Reset buffer and start listening for "peeko"
        setBuffer("");
        if (bufferTimeout) clearTimeout(bufferTimeout);
        const timeout = setTimeout(() => {
          setClicks(0);
          setBuffer("");
        }, 5000);
        setBufferTimeout(timeout);
      }
    } else {
      setClicks(1);
    }
    setLastClickTime(now);
  }, [clicks, lastClickTime, bufferTimeout]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (clicks === 2) {
        setBuffer(prev => {
          const newBuffer = prev + e.key;
          if (newBuffer === "peeko") {
            onShowApiManager();
            setClicks(0);
            setBuffer("");
            if (bufferTimeout) clearTimeout(bufferTimeout);
          }
          return newBuffer;
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (bufferTimeout) clearTimeout(bufferTimeout);
    };
  }, [clicks, onShowApiManager, bufferTimeout]);

  return (
    <div 
      className="w-64 h-screen bg-sidebar-background border-r border-border flex flex-col py-6 px-3"
      onClick={handleSidebarClick}
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
        <div className="text-sm text-muted-foreground">
          Version 1.1.09
        </div>
      </div>
    </div>
  );
};

export default Sidebar;