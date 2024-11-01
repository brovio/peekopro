import { useSettings } from "@/contexts/SettingsContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

const defaultCategories = [
  "Work Day",
  "Delegate",
  "Discuss",
  "Family",
  "Personal",
  "Ideas",
  "App Ideas",
  "Project Ideas",
  "Monkey Thoughts"
];

const CategorySettings = () => {
  const { 
    visibleCategories, 
    toggleCategory, 
    categorySettings,
    toggleCategoryProgress,
    updateCategoryOrder 
  } = useSettings();

  const sortedCategories = [...defaultCategories].sort((a, b) => 
    (categorySettings[a]?.order || 0) - (categorySettings[b]?.order || 0)
  );

  const moveCategory = (category: string, direction: 'up' | 'down') => {
    const currentOrder = categorySettings[category]?.order || 0;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    updateCategoryOrder(category, newOrder);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Visible Categories</h3>
      <div className="space-y-4">
        {sortedCategories.map((category) => (
          <div key={category} className="flex items-center justify-between space-x-4 p-2 bg-secondary/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Switch
                id={`category-${category}`}
                checked={visibleCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor={`progress-${category}`}>Show Progress</Label>
                <Switch
                  id={`progress-${category}`}
                  checked={categorySettings[category]?.showProgress}
                  onCheckedChange={() => toggleCategoryProgress(category)}
                />
              </div>
              
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveCategory(category, 'up')}
                  disabled={categorySettings[category]?.order === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveCategory(category, 'down')}
                  disabled={categorySettings[category]?.order === sortedCategories.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySettings;