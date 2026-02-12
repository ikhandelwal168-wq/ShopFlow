export type UserRole = 'admin' | 'staff' | 'viewer'

export interface UserProfile {
  id: string
  full_name: string | null
  role: UserRole | null
  created_at: string
}
