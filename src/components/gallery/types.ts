export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  provider: string;
  model: string;
  styles: string[];
  width: number;
  height: number;
  format: string;
  cost: number;
  created_at: string;
}