import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, Home, FileText, SplitSquareVertical, Settings, BookOpen, Image, GalleryHorizontal, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Menu = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
    retry: false
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:opacity-80">
          <MenuIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <nav className="flex flex-col gap-2 mt-8">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-5 w-5" />
              Home
            </Button>
          </Link>
          <Link to="/subtask">
            <Button variant="ghost" className="w-full justify-start">
              <SplitSquareVertical className="mr-2 h-5 w-5" />
              Subtask It!
            </Button>
          </Link>
          <Link to="/notes">
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-5 w-5" />
              Notes
            </Button>
          </Link>
          <Link to="/journal">
            <Button variant="ghost" className="w-full justify-start">
              <BookOpen className="mr-2 h-5 w-5" />
              Journal
            </Button>
          </Link>
          <Link to="/images">
            <Button variant="ghost" className="w-full justify-start">
              <Image className="mr-2 h-5 w-5" />
              Images
            </Button>
          </Link>
          <Link to="/gallery">
            <Button variant="ghost" className="w-full justify-start">
              <GalleryHorizontal className="mr-2 h-5 w-5" />
              Gallery
            </Button>
          </Link>
          {profile?.is_admin && (
            <Link to="/admin">
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="mr-2 h-5 w-5" />
                Admin Pro
              </Button>
            </Link>
          )}
          <Link to="/options">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-5 w-5" />
              Options
            </Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Menu;