import { createClient } from '@supabase/supabase-js';

// Access environmental secret strings safe from visual data leaks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DatabaseHabit {
  id: string;
  user_id: string;
  name: string;
  category: string;
  streak: number;
  days_target: number;
  completed_days: number;
  updated_at: string;
}
