import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
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
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string
          avatar_url: string | null
          role: 'client' | 'freelancer' | 'company'
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name: string
          avatar_url?: string | null
          role: 'client' | 'freelancer' | 'company'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          avatar_url?: string | null
          role?: 'client' | 'freelancer' | 'company'
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          status: 'pending' | 'in-progress' | 'completed'
          client_id: string
          freelancer_id: string | null
          start_date: string
          due_date: string | null
          budget: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          status?: 'pending' | 'in-progress' | 'completed'
          client_id: string
          freelancer_id?: string | null
          start_date: string
          due_date?: string | null
          budget: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          status?: 'pending' | 'in-progress' | 'completed'
          client_id?: string
          freelancer_id?: string | null
          start_date?: string
          due_date?: string | null
          budget?: number
        }
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          client_id: string
          provider_id: string
          provider_type: 'freelancer' | 'company'
          package_id: string
          status: 'pending' | 'confirmed' | 'declined'
          date: string
          time: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          client_id: string
          provider_id: string
          provider_type: 'freelancer' | 'company'
          package_id: string
          status?: 'pending' | 'confirmed' | 'declined'
          date: string
          time: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          client_id?: string
          provider_id?: string
          provider_type?: 'freelancer' | 'company'
          package_id?: string
          status?: 'pending' | 'confirmed' | 'declined'
          date?: string
          time?: string
          notes?: string | null
        }
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
  }
} 