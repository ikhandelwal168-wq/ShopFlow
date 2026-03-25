import { useMemo, useState } from 'react'
import { Bell, Monitor, Moon, ScanLine, ScanSearch, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [compactDevice, setCompactDevice] = useState(false)

  const activeTheme = useMemo<'light' | 'dark'>(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  }, [theme])

  const toggleDevice = () => {
    const next = !compactDevice
    setCompactDevice(next)
    document.body.classList.toggle('device-compact', next)
  }

  const focusGlobalSearch = () => {
    const search = document.getElementById('global-search') as HTMLInputElement | null
    if (search) {
      search.focus()
      search.select()
    }
  }

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      return
    }
    await document.exitFullscreen()
  }

  return (
    <header className="h-16 border-b border-[#dfe6f2] bg-white px-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex h-full max-w-[1800px] items-center justify-between">
        <div className="w-44" />

        <p className="text-xl font-medium text-[#2d3953] dark:text-slate-100">ShopFlow Smart Inventory &amp; Billing</p>

        <div className="flex items-center gap-4 text-sm text-[#304467] dark:text-slate-300">
          <button
            type="button"
            onClick={toggleDevice}
            className={`flex items-center gap-2 rounded-lg px-2 py-1 ${compactDevice ? 'bg-blue-100 text-blue-700 dark:bg-slate-800 dark:text-blue-300' : ''}`}
            aria-label="Toggle compact device view"
            title="Toggle compact device view"
          >
            <Monitor size={20} />
            <span>Device</span>
          </button>

          <button type="button" onClick={focusGlobalSearch} aria-label="Focus search" title="Focus search">
            <ScanSearch size={20} />
          </button>

          <button type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen" title="Toggle fullscreen">
            <ScanLine size={20} />
          </button>

          <button
            type="button"
            onClick={() => setTheme(activeTheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {activeTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="relative">
            <button
              type="button"
              className="relative text-[#6f7f98] dark:text-slate-300"
              aria-label="Notifications"
              onClick={() => setShowNotifications((v) => !v)}
            >
              <Bell size={20} />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#ff4d6d]" />
            </button>

            {showNotifications ? (
              <div className="absolute right-0 top-8 w-72 rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <p className="font-semibold">Notifications</p>
                <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-300">
                  <li>Low stock items require attention.</li>
                  <li>Daily sales report is ready.</li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
