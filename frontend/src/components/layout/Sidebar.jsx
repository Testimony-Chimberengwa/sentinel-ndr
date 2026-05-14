import { Activity, Bell, Cpu, Gauge, Menu, Radar, Settings, ShieldCheck, SlidersHorizontal, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/devices', label: 'Devices', icon: Cpu },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/response-actions', label: 'Response', icon: ShieldCheck },
  { to: '/threats', label: 'Threats', icon: Radar },
  { to: '/models', label: 'Models', icon: SlidersHorizontal },
  { to: '/baseline', label: 'Baseline', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ collapsed = false, onToggle }) {
  return (
    <aside className={`sticky top-0 h-screen border-r border-tron-border bg-tron-dark/80 p-4 backdrop-blur-md transition-all ${collapsed ? 'w-[84px]' : 'w-full'}`}>
      <div className="mb-6 flex items-center justify-between gap-2">
        {!collapsed ? <p className="font-display text-xl text-tron-cyan">SENTINEL</p> : <p className="font-display text-lg text-tron-cyan">S</p>}
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center justify-center border border-tron-border p-2 text-tron-cyan hover:bg-tron-cyan/10"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>
      <nav className="space-y-2">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} border-l-2 px-3 py-3 text-sm tracking-[0.08em] ${
                isActive
                  ? 'border-tron-cyan bg-tron-cyan/10 text-tron-text-bright shadow-glow-cyan'
                  : 'border-transparent text-tron-text hover:bg-tron-panel/70 hover:text-tron-cyan'
              }`
            }
            title={label}
          >
            <Icon size={18} />
            {!collapsed ? label : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
