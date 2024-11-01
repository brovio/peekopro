import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SettingsDialog from "@/components/settings/SettingsDialog";

const Navbar = () => {
  return (
    <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>
        <SettingsDialog />
      </div>
    </div>
  );
};

export default Navbar;