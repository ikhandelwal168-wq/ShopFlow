import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const invalidAnon =
  !supabaseAnonKey ||
  supabaseAnonKey === 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE' ||
  supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY'

if (!supabaseUrl || invalidAnon) {
  console.warn(
    'Supabase config missing/invalid. Set VITE_SUPABASE_URL and a real VITE_SUPABASE_ANON_KEY in .env, then restart dev server.',
  )
}

export const supabase = createClient(supabaseUrl ?? '', invalidAnon ? 'invalid-key' : supabaseAnonKey)
