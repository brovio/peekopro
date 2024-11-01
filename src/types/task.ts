export interface Task {
  id: string;
  content: string;
  category: string | null;
  confidence: number;
}