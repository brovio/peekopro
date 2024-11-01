import { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  visibleCategories: string[];
  toggleCategory: (category: string) => void;
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
  "Monkey Thoughts"
];

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [visibleCategories, setVisibleCategories] = useState<string[]>(defaultCategories);

  const toggleCategory = (category: string) => {
    setVisibleCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <SettingsContext.Provider value={{ visibleCategories, toggleCategory }}>
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