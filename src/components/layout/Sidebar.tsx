import { BarChart3, Boxes, LayoutDashboard, LogOut, PanelLeftOpen, Settings, ShoppingCart, TriangleAlert, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Inventory', icon: Boxes },
  { to: '/billing', label: 'Billing', icon: ShoppingCart },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/low-stock', label: 'Low Stock', icon: TriangleAlert },
  { to: '/settings', label: 'Settings', icon: Settings },
]

interface Props {
  collapsed: boolean
  onCollapse: () => void
  onExpand: () => void
}

export function Sidebar({ collapsed, onCollapse, onExpand }: Props) {
  const { signOut } = useAuth()

  return (
    <aside className={`flex w-full flex-col border-r border-[#1b2e55] bg-[#081735] text-[#d5dff7] md:sticky md:top-0 md:h-screen ${collapsed ? 'md:w-[82px]' : 'md:w-[260px]'}`}>
      <div className={`flex items-center ${collapsed ? 'justify-center px-2 py-5' : 'justify-between px-6 py-7'}`}>
        {!collapsed ? <span className="text-[38px] font-bold leading-none text-[#49a0ff]">ShopFlow</span> : <span className="text-xl font-bold text-[#49a0ff]">SF</span>}
        <button
          type="button"
          className={`text-[#9fb3da] ${collapsed ? 'absolute left-1/2 -translate-x-1/2 mt-10' : ''}`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={collapsed ? onExpand : onCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <X size={30} />}
        </button>
      </div>

      <nav className={`space-y-1.5 ${collapsed ? 'px-2 pt-5' : 'px-4'}`}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex items-center rounded-2xl py-3 text-[15px] font-medium transition-colors ${
                collapsed ? 'justify-center px-0' : 'gap-3 px-4'
              } ${
                isActive ? 'bg-[#2f66de] text-white' : 'text-[#9fb3da] hover:bg-[#11254c] hover:text-white'
              }`
            }
          >
            <Icon size={20} strokeWidth={2} />
            {!collapsed ? <span>{label}</span> : null}
          </NavLink>
        ))}
      </nav>

      <div className={`mt-auto border-t border-[#1b2e55] ${collapsed ? 'px-2 py-5' : 'px-4 py-5'}`}>
        <button
          type="button"
          onClick={() => void signOut()}
          title="Logout"
          className={`flex w-full items-center rounded-2xl py-3 text-left text-[15px] font-medium text-[#9fb3da] transition-colors hover:bg-[#11254c] hover:text-white ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'}`}
        >
          <LogOut size={20} strokeWidth={2} />
          {!collapsed ? <span>Logout</span> : null}
        </button>
      </div>
    </aside>
  )
}
