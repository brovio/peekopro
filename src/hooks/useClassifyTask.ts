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
        // Mock classification logic
        const randomConfidence = Math.random();
        const categories = ["work", "personal", "later", "done"];
        resolve({
          category: categories[Math.floor(Math.random() * categories.length)],
          confidence: randomConfidence,
        });
      }, 500);
    });
  };

  return {
    classifyTask,
    isClassifying: false,
  };
};