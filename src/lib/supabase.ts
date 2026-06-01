import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || ''
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON || ''

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

export type Database = {
  public: {
    Tables: {
      progress: {
        Row: { id: string; user_id: string; day: number; score: number; completed: boolean; notes: string; updated_at: string }
        Insert: Omit<Database['public']['Tables']['progress']['Row'], 'id'>
      }
    }
  }
}
