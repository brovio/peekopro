import { Menu, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const Test = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="h-[100px] bg-black flex items-center justify-between px-6">
        <Button variant="ghost" size="icon" className="text-white hover:text-gray-300">
          <Menu className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/eed02813-10fd-4028-a218-8deef97ff463.png" 
            alt="Flooko Logo" 
            className="h-8"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="text-white hover:text-gray-300">
          <LogIn className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Test Page</h1>
        <p>This is the test page content.</p>
      </div>
    </div>
  );
};

export default Test;