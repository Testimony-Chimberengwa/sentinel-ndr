import { useEffect, useState } from 'react'

export default function ThreatGauge({ value, size = 150, label = 'Fusion', color }) {
  const v = Math.max(0, Math.min(100, value))
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(v), 60)
    return () => clearTimeout(t)
  }, [v])

  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const visible = (270 / 360) * circumference
  const dashOffset = visible * (1 - animated / 100)
  const rotation = -135 + (animated / 100) * 270

  const tone = animated >= 75 ? 'var(--gx-red)' : animated >= 50 ? 'var(--tron-amber)' : color || 'var(--gx-trace)'

  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ width: size, height: size }} className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <filter id="gGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
            fill="none"
            transform={`rotate(-135 ${size / 2} ${size / 2})`}
            strokeLinecap="round"
          />

          {/* active arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={tone}
            strokeWidth={stroke}
            strokeDasharray={`${visible} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-135 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 600ms cubic-bezier(.2,.9,.2,1), stroke 300ms' }}
            filter="url(#gGlow)"
          />

          {/* needle */}
          <g transform={`translate(${size / 2}, ${size / 2})`}>
            <line x1="0" y1="0" x2="0" y2={-radius + stroke / 2 - 6} stroke={tone} strokeWidth={2.5} strokeLinecap="round" transform={`rotate(${rotation})`} style={{ transition: 'transform 600ms cubic-bezier(.2,.9,.2,1)' }} />
            <circle r={6} fill={tone} stroke="#0a0a0f" strokeWidth={1.5} />
          </g>
        </svg>

        {/* center octagon with percentage */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 octagon grid place-items-center border border-tron-border bg-gx-panel text-center" style={{ width: `${size * 0.56}px`, height: `${size * 0.56}px` }}>
          <p className="font-display text-2xl text-tron-text-bright">{Math.round(animated)}%</p>
        </div>
      </div>

      <p className="text-xs uppercase tracking-[0.2em] text-tron-text">{label}</p>
    </div>
  )
}
