import { Activity, Bell, Cpu, Gauge, Radar, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/devices', label: 'Devices', icon: Cpu },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/threats', label: 'Threats', icon: Radar },
  { to: '/baseline', label: 'Baseline', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen border-r border-tron-border bg-tron-dark/80 p-4 backdrop-blur-md">
      <p className="mb-6 font-display text-xl text-tron-cyan">SENTINEL</p>
      <nav className="space-y-2">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 border-l-2 px-3 py-3 text-sm tracking-[0.08em] ${
                isActive
                  ? 'border-tron-cyan bg-tron-cyan/10 text-tron-text-bright shadow-glow-cyan'
                  : 'border-transparent text-tron-text hover:bg-tron-panel/70 hover:text-tron-cyan'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
