import type { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
