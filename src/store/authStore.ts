import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, supabaseConfigError } from '@/lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    if (supabaseConfigError) {
      set({ user: null, initialized: true })
      return
    }
    const { data } = await supabase.auth.getSession()
    set({ user: data.session?.user ?? null, initialized: true })
    supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      set({ user: session?.user ?? null })
    })
  },

  signIn: async (email, password) => {
    if (supabaseConfigError) throw new Error(supabaseConfigError)
    set({ loading: true })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    set({ loading: false })
    if (error) throw error
  },

  signUp: async (email, password, fullName) => {
    if (supabaseConfigError) throw new Error(supabaseConfigError)
    set({ loading: true })
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: 'admin' },
      },
    })
    set({ loading: false })
    if (error) throw error
  },

  signInWithGoogle: async () => {
    if (supabaseConfigError) throw new Error(supabaseConfigError)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) throw error
  },

  signOut: async () => {
    if (supabaseConfigError) {
      set({ user: null })
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    set({ user: null })
  },
}))
