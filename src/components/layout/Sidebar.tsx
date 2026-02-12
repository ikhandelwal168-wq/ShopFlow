import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/billing', label: 'Billing' },
  { to: '/reports', label: 'Reports' },
  { to: '/low-stock', label: 'Low Stock' },
  { to: '/setup-health', label: 'Setup Health' },
  { to: '/settings', label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="w-full border-r border-slate-200 bg-slate-950 text-slate-50 md:w-64">
      <div className="border-b border-slate-800 px-4 py-4 text-lg font-semibold">ShopFlow</div>
      <nav className="p-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `mb-1 block rounded px-3 py-2 text-sm transition ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-800'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
