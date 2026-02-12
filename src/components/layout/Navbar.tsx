import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'

export function Navbar() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <p className="text-sm text-slate-600 dark:text-slate-300">Smart Inventory + Billing</p>
        <input
          id="header-search-hint"
          className="hidden rounded border px-2 py-1 text-xs md:block dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          placeholder="Ctrl/Cmd + K"
          readOnly
        />
      </div>
      <div className="flex items-center gap-3">
        <select
          className="rounded border px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          aria-label="Theme"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <span className="text-sm text-slate-700 dark:text-slate-200">{user?.email}</span>
        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded bg-slate-900 px-3 py-1.5 text-xs text-white hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
