import { useSettings } from "@/contexts/SettingsContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const { visibleCategories, toggleCategory } = useSettings();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Visible Categories</h3>
      <div className="space-y-4">
        {defaultCategories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Switch
              id={`category-${category}`}
              checked={visibleCategories.includes(category)}
              onCheckedChange={() => toggleCategory(category)}
            />
            <Label htmlFor={`category-${category}`}>{category}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySettings;