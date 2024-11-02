export interface SubTask {
  id: string;
  content: string;
  completed: boolean;
}

export interface WorkDayTaskAttributes {
  estimatedTime?: number; // in minutes
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
  subtasks?: SubTask[];
  workDayAttributes?: WorkDayTaskAttributes;
}