import { useState } from 'react';
import { Task } from '@/types/task';

export const useTaskHistory = () => {
  const [history, setHistory] = useState<Task[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const pushState = (tasks: Task[]) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push([...tasks]);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return history[currentIndex - 1];
    }
    return null;
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return history[currentIndex + 1];
    }
    return null;
  };

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo
  };
};