import { Activity, Bell, Cpu, Gauge, Radar, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/devices', label: 'Devices', icon: Cpu },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/threats', label: 'Threats', icon: Radar },
  { to: '/baseline', label: 'Baseline', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`sticky top-0 h-screen sx-sidebar ${expanded ? 'expanded' : ''} border-r border-tron-border bg-gx-panel/80 p-2 backdrop-blur-md flex flex-col items-stretch`}
    >
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="icon-only" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l7 3v5c0 5-3.5 9-7 12-3.5-3-7-7-7-12V5l7-3z" fill="currentColor" />
            <path d="M9.5 11.5l1.8 1.8 3.2-3.2" stroke="#0a0a0f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="ml-2 nav-label font-display text-lg text-tron-cyan">SENTINEL</div>
      </div>

      <nav className="mt-4 flex-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-2 py-3 rounded-md my-1 mx-2 transition-colors ${
                isActive
                  ? 'bg-gx-charcoal text-tron-text-bright shadow-[0_0_18px_rgba(0,245,255,0.08)] border-l-4 border-gx-trace'
                  : 'text-tron-text hover:bg-tron-panel/60 hover:text-tron-cyan'
              }`
            }
          >
            <div className="icon-only text-tron-text group-[.active]:text-tron-cyan">
              <Icon size={18} className={""} />
            </div>
            <div className="nav-label text-sm tracking-[0.04em]">{label}</div>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4">
        <button
          onClick={() => setExpanded((s) => !s)}
          className="w-full text-xs uppercase tracking-wider text-tron-text-bright bg-transparent border border-tron-border px-3 py-2 rounded-md"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {/* right-edge chrome gradient */}
      <div aria-hidden className="absolute right-0 top-0 h-full w-[4px] rounded-l-md" style={{ background: 'linear-gradient(180deg,#00f5ff10,#ff204020)' }} />
    </aside>
  )
}
