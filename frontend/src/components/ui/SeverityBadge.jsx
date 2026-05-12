const map = {
  CRITICAL: 'border-tron-red text-tron-red shadow-glow-red animate-pulseCritical',
  HIGH: 'border-orange-400 text-orange-300 shadow-[0_0_10px_rgba(255,140,0,0.35)]',
  MEDIUM: 'border-tron-amber text-tron-amber shadow-[0_0_10px_rgba(255,170,0,0.35)]',
  LOW: 'border-tron-cyan-dim text-tron-cyan-dim',
}

export default function SeverityBadge({ severity }) {
  return (
    <span className={`inline-flex border px-2 py-1 text-[11px] uppercase tracking-[0.18em] ${map[severity] || map.LOW}`}>
      {severity}
    </span>
  )
}
