import { createContext, useContext, useState, ReactNode } from "react";

interface CategorySettings {
  visible: boolean;
  showProgress: boolean;
  order: number;
}

interface SettingsContextType {
  visibleCategories: string[];
  showProgress: boolean;
  categorySettings: Record<string, CategorySettings>;
  pendingTheme: string | null;
  toggleCategory: (category: string) => void;
  toggleProgress: () => void;
  toggleCategoryProgress: (category: string) => void;
  updateCategoryOrder: (category: string, newOrder: number) => void;
  setPendingTheme: (theme: string) => void;
  saveSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultCategories = [
  "Work Day",
  "Delegate",
  "Discuss",
  "Family",
  "Personal",
  "Ideas",
  "App Ideas",
  "Project Ideas",
  "Monkey Thoughts",
  "Complete"
];

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [visibleCategories, setVisibleCategories] = useState<string[]>(defaultCategories);
  const [showProgress, setShowProgress] = useState(false); // Changed to false by default
  const [pendingTheme, setPendingTheme] = useState<string | null>(null);
  const [categorySettings, setCategorySettings] = useState<Record<string, CategorySettings>>(() => {
    const initial: Record<string, CategorySettings> = {};
    defaultCategories.forEach((category, index) => {
      initial[category] = {
        visible: true,
        showProgress: false, // Changed to false by default
        order: index
      };
    });
    return initial;
  });

  const toggleCategory = (category: string) => {
    setVisibleCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleProgress = () => {
    setShowProgress(prev => !prev);
  };

  const toggleCategoryProgress = (category: string) => {
    setCategorySettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        showProgress: !prev[category].showProgress
      }
    }));
  };

  const updateCategoryOrder = (category: string, newOrder: number) => {
    setCategorySettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        order: newOrder
      }
    }));
  };

  const saveSettings = () => {
    if (pendingTheme) {
      // This will be handled by ThemeSettings component
      setPendingTheme(null);
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      visibleCategories, 
      showProgress,
      categorySettings,
      pendingTheme,
      toggleCategory,
      toggleProgress,
      toggleCategoryProgress,
      updateCategoryOrder,
      setPendingTheme,
      saveSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}