import { useEffect, useState } from 'react'
import { useWebSocket } from '../../hooks/useWebSocket'

export default function TopNav() {
  const [utc, setUtc] = useState(new Date().toUTCString())
  const { connected } = useWebSocket()

  useEffect(() => {
    const t = setInterval(() => setUtc(new Date().toUTCString()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="mb-4 border border-tron-border bg-tron-dark/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl tracking-[0.18em] text-tron-text-bright">SENTINEL NDR</h1>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em]">
          <span className={`border px-2 py-1 ${connected ? 'border-tron-cyan text-tron-cyan' : 'border-tron-red text-tron-red'}`}>
            {connected ? 'ACTIVE / MONITORING' : 'SENSOR LINK DOWN'}
          </span>
          <span className="border border-tron-border px-2 py-1 text-tron-text">{utc}</span>
        </div>
      </div>
    </header>
  )
}
