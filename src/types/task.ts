import { Json } from "@/integrations/supabase/types";

export interface SubTask {
  id: string;
  content: string;
  completed: boolean;
}

export interface WorkDayTaskAttributes {
  estimatedTime?: number;
  priority?: 'low' | 'medium' | 'high';
  difficulty?: 'easy' | 'medium' | 'hard';
  collaborators?: string[];
  dueDate?: string;
  reminders?: string[];
}

export interface Task {
  id: string;
  content: string;
  category: string | null;
  confidence: number;
  completed?: boolean;
  created_at?: string;
  user_id?: string;
  subtasks?: SubTask[];
  workDayAttributes?: WorkDayTaskAttributes;
}

export interface TaskInput {
  content: string;  // Made required
  category?: string | null;
  confidence?: number;
  completed?: boolean;
  created_at?: string;
  user_id: string;  // Made required
  subtasks?: Json;
}