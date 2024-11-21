export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      journal_entries: {
        Row: {
          content: string | null
          created_at: string
          goals: string[] | null
          gratitude: string[] | null
          id: string
          mood: number | null
          reflections: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          goals?: string[] | null
          gratitude?: string[] | null
          id?: string
          mood?: number | null
          reflections?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          goals?: string[] | null
          gratitude?: string[] | null
          id?: string
          mood?: number | null
          reflections?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          text_color: string
          title: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          text_color?: string
          title: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          text_color?: string
          title?: string
          user_id: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          attachments: Json | null
          breakdown_comments: string | null
          category: string | null
          completed: boolean | null
          confidence: number | null
          content: string
          created_at: string
          id: string
          subtasks: Json | null
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          breakdown_comments?: string | null
          category?: string | null
          completed?: boolean | null
          confidence?: number | null
          content: string
          created_at?: string
          id?: string
          subtasks?: Json | null
          user_id: string
        }
        Update: {
          attachments?: Json | null
          breakdown_comments?: string | null
          category?: string | null
          completed?: boolean | null
          confidence?: number | null
          content?: string
          created_at?: string
          id?: string
          subtasks?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
