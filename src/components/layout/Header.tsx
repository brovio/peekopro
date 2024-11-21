import { Menu, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface HeaderProps {
  onShowApiManager: () => void;
}

const Header = ({ onShowApiManager }: HeaderProps) => {
  const [clicks, setClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [buffer, setBuffer] = useState("");
  const [bufferTimeout, setBufferTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleHeaderClick = () => {
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
      className="h-[100px] bg-black flex items-center justify-between px-3 sm:px-6"
      onClick={handleHeaderClick}
    >
      <Button variant="ghost" size="icon" className="hover:opacity-80">
        <Menu className="h-6 w-6 text-white" />
      </Button>
      
      <div className="flex-1 flex justify-center px-2 sm:px-4">
        <img 
          src="/lovable-uploads/3fcd2b3e-6c2e-4e5e-a2ce-3c8528cf39b3.png"
          alt="Flooko Logo"
          className="w-[200px] sm:w-[300px] object-contain my-[1px]"
        />
      </div>
      
      <Button variant="ghost" size="icon" className="hover:opacity-80">
        <LogIn className="h-6 w-6 text-white" />
      </Button>
    </header>
  );
};

export default Header;