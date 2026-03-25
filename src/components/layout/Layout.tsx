import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'

const titleByPath: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Inventory',
  '/billing': 'Billing',
  '/reports': 'Reports',
  '/low-stock': 'Low Stock',
  '/settings': 'Settings',
  '/setup-health': 'Setup Health',
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const [customName, setCustomName] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => localStorage.getItem('shopflow-sidebar-collapsed') === '1')
  const title = titleByPath[pathname] ?? 'Dashboard'

  useEffect(() => {
    setCustomName(localStorage.getItem('shopflow-display-name') ?? '')
    const onPreferencesUpdated = () => {
      setCustomName(localStorage.getItem('shopflow-display-name') ?? '')
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'shopflow-display-name') {
        setCustomName(event.newValue ?? '')
      }
    }
    window.addEventListener('shopflow-preferences-updated', onPreferencesUpdated)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('shopflow-preferences-updated', onPreferencesUpdated)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const displayName = useMemo(() => {
    const fullName = String(user?.user_metadata?.full_name ?? '').trim()
    const fallback = String(user?.email ?? '').split('@')[0]
    return customName.trim() || fullName || fallback || 'User'
  }, [customName, user?.email, user?.user_metadata?.full_name])

  const initials = useMemo(() => {
    const parts = displayName.split(/\s+/).filter(Boolean)
    if (!parts.length) return 'U'
    return parts
      .slice(0, 2)
      .map((part) => part[0]!.toUpperCase())
      .join('')
  }, [displayName])

  return (
    <div className="min-h-screen bg-[#eff3f9] md:flex dark:bg-[#070d1a]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={() => {
          setSidebarCollapsed(true)
          localStorage.setItem('shopflow-sidebar-collapsed', '1')
        }}
        onExpand={() => {
          setSidebarCollapsed(false)
          localStorage.setItem('shopflow-sidebar-collapsed', '0')
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <div className="flex h-16 items-center justify-between border-b border-[#dfe6f2] bg-white px-6 dark:border-slate-700 dark:bg-slate-900">
          <h1 className="text-[34px] font-bold text-[#1f2b46] dark:text-slate-100">{title}</h1>
          <div className="flex items-center gap-4 border-l border-[#dfe6f2] pl-6 dark:border-slate-700">
            <div className="text-right leading-tight">
              <p className="text-base font-semibold text-[#1f2b46] dark:text-slate-100">{displayName}</p>
              <p className="text-sm text-[#6f7f98] dark:text-slate-400">Administrator</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4e69e6] text-sm font-semibold text-white">
              {initials}
            </div>
          </div>
        </div>

        <main className="min-w-0 flex-1 p-5 md:p-6">{children}</main>
      </div>
    </div>
  )
}
