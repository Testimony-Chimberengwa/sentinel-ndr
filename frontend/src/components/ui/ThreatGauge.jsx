export default function ThreatGauge({ value, size = 150, label = 'Fusion', color = '#00f5ff' }) {
  const v = Math.max(0, Math.min(100, value))
  const ring = {
    background: `conic-gradient(${color} ${v * 3.6}deg, rgba(255,255,255,0.09) 0deg)`,
    width: `${size}px`,
    height: `${size}px`,
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative grid place-items-center border border-tron-border p-2" style={ring}>
        <div
          className="grid place-items-center border border-tron-border bg-tron-black text-center"
          style={{ width: `${size - 32}px`, height: `${size - 32}px` }}
        >
          <p className="font-display text-2xl text-tron-text-bright">{v}%</p>
        </div>
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-tron-text">{label}</p>
    </div>
  )
}
