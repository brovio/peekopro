import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Menu from "./Menu";
import { Link } from "react-router-dom";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface HeaderProps {
  onShowApiManager: () => void;
}

const Header = ({ onShowApiManager }: HeaderProps) => {
  const [clicks, setClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [buffer, setBuffer] = useState("");
  const [bufferTimeout, setBufferTimeout] = useState<NodeJS.Timeout | null>(null);
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
        <Link to="/">
          <img 
            src="/lovable-uploads/flomigo-logo.png"
            alt="Flomigo Logo"
            className="w-[150px] sm:w-[300px] object-contain my-[1px]"
          />
        </Link>
      </div>
      
      <NotificationBell />
    </header>
  );
};

export default Header;