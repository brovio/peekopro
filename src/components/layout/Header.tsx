import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Menu from "./Menu";

interface HeaderProps {
  onShowApiManager: () => void;
}

const Header = ({ onShowApiManager }: HeaderProps) => {
  const [clicks, setClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [buffer, setBuffer] = useState("");
  const [bufferTimeout, setBufferTimeout] = useState<NodeJS.Timeout | null>(null);
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleHeaderClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 500) {
      setClicks(prev => prev + 1);
      if (clicks === 1) {
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
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    }
  };

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
    <header 
      className="h-[100px] sm:h-[100px] h-[75px] bg-black flex items-center justify-between px-3 sm:px-6"
      onClick={handleHeaderClick}
    >
      <Menu />
      
      <div className="flex-1 flex justify-center px-2 sm:px-4">
        <img 
          src="/lovable-uploads/d6cae13f-62a5-4f3a-92c8-a89b6b20d71d.png"
          alt="Peekopro Logo"
          className="w-[150px] sm:w-[300px] object-contain my-[1px]"
        />
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="hover:opacity-80"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </Button>
    </header>
  );
};

export default Header;