import { useQuery } from "@tanstack/react-query";

interface ClassificationResult {
  category: string;
  confidence: number;
}

export const useClassifyTask = () => {
  const classifyTask = async (content: string): Promise<ClassificationResult> => {
    // This is a mock implementation - replace with actual GPT-4-mini API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = [
          "work day",
          "delegate",
          "discuss",
          "family",
          "personal",
          "ideas",
          "app ideas",
          "project ideas",
          "meetings",
          "follow-up",
          "urgent"
        ];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        resolve({
          category: randomCategory,
          confidence: Math.random(),
        });
      }, 500);
    });
  };

  return {
    classifyTask,
    isClassifying: false,
  };
};