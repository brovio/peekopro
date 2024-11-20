import { Search, LogOut, Undo2, Redo2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SettingsDialog from "@/components/settings/SettingsDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface NavbarProps {
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const Navbar = ({ onUndo, onRedo, canUndo, canRedo }: NavbarProps) => {
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <div className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 w-full bg-muted/50 border-input focus:bg-background transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {onUndo && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onUndo}
            disabled={!canUndo}
            className="relative"
          >
            <Undo2 className="w-5 h-5 text-foreground" />
          </Button>
        )}
        {onRedo && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRedo}
            disabled={!canRedo}
            className="relative"
          >
            <Redo2 className="w-5 h-5 text-foreground" />
          </Button>
        )}
        <NotificationBell />
        <SettingsDialog />
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="w-5 h-5 text-foreground" />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;