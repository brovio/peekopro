import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, Home, FileText, SplitSquareVertical, Settings, BookOpen, Image, GalleryHorizontal, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Menu = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:opacity-80">
          <MenuIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <nav className="flex flex-col gap-2 mt-8">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => handleNavigation("/")}
          >
            <Home className="mr-2 h-5 w-5" />
            Home
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => handleNavigation("/subtask")}
          >
            <SplitSquareVertical className="mr-2 h-5 w-5" />
            Subtask It!
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => handleNavigation("/notes")}
          >
            <FileText className="mr-2 h-5 w-5" />
            Notes
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => handleNavigation("/journal")}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Journal
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => handleNavigation("/images")}
          >
            <Image className="mr-2 h-5 w-5" />
            Images
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => handleNavigation("/gallery")}
          >
            <GalleryHorizontal className="mr-2 h-5 w-5" />
            Gallery
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => handleNavigation("/options")}
          >
            <Settings className="mr-2 h-5 w-5" />
            Options
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Menu;