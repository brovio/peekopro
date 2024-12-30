import { createContext, useContext } from 'react';
import { Task } from '@/types/task';

interface CategoryContextType {
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskMove?: (taskId: string, category: string) => void;
}

const CategoryContext = createContext<CategoryContextType>({});

export const useCategoryContext = () => useContext(CategoryContext);

export const CategoryProvider = CategoryContext.Provider;