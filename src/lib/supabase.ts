import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const invalidAnon =
  !supabaseAnonKey ||
  supabaseAnonKey === 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE' ||
  supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY'
const invalidUrl = !supabaseUrl || !String(supabaseUrl).startsWith('http')

export const supabaseConfigError =
  invalidUrl || invalidAnon
    ? 'Supabase env missing/invalid. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart dev server.'
    : null

if (supabaseConfigError) {
  console.error(supabaseConfigError)
}

export const supabase = createClient(
  invalidUrl ? 'https://invalid.supabase.local' : supabaseUrl,
  invalidAnon ? 'invalid-key' : supabaseAnonKey,
)
