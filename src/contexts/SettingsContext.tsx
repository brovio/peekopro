import { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  visibleCategories: string[];
  showProgress: boolean;
  toggleCategory: (category: string) => void;
  toggleProgress: () => void;
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
  const [showProgress, setShowProgress] = useState(true);

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

  return (
    <SettingsContext.Provider value={{ 
      visibleCategories, 
      showProgress,
      toggleCategory,
      toggleProgress
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