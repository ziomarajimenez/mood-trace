export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      moods: {
        Row: {
          analysis: string
          created_at: string
          description: string
          id: string
          mood: string
        }
        Insert: {
          analysis: string
          created_at?: string
          description: string
          id?: string
          mood: string
        }
        Update: {
          analysis?: string
          created_at?: string
          description?: string
          id?: string
          mood?: string
        }
        Relationships: []
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
