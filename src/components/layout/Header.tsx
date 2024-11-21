import { Menu, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="h-[100px] bg-navy-900 flex items-center justify-between px-6">
      <Button variant="ghost" size="icon" className="hover:opacity-80">
        <Menu className="h-6 w-6 text-white" />
      </Button>
      
      <div className="flex-1 flex justify-center">
        <img 
          src="/lovable-uploads/3fcd2b3e-6c2e-4e5e-a2ce-3c8528cf39b3.png"
          alt="Flooko Logo"
          className="h-[98px] object-contain my-[1px]"
        />
      </div>
      
      <Button variant="ghost" size="icon" className="hover:opacity-80">
        <LogIn className="h-6 w-6 text-white" />
      </Button>
    </header>
  );
};

export default Header;