import { useEffect, useState } from 'react'
import AnomalyTimeline from '../components/charts/AnomalyTimeline'
import HUDCard from '../components/ui/HUDCard'
import SeverityBadge from '../components/ui/SeverityBadge'
import ThreatGauge from '../components/ui/ThreatGauge'
import { alertFeed, anomalyTimeline, dashboardMetrics } from '../data/mockData'
import { useResponseActions } from '../hooks/useResponseActions'

function Counter({ value, suffix = '' }) {
  const [v, setV] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 24
    const inc = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += inc
      if (current >= value) {
        setV(value)
        clearInterval(timer)
      } else {
        setV(current)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return <span>{Number.isInteger(value) ? Math.round(v) : v.toFixed(2)}{suffix}</span>
}

export default function Dashboard() {
  const { activeEnforcedCount } = useResponseActions()
  const metrics = [...dashboardMetrics, { key: 'activeActions', label: 'Active Enforced Actions', value: activeEnforcedCount, suffix: '' }]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((m) => (
          <HUDCard key={m.key} title={m.label}>
            <p className="font-display text-3xl text-tron-text-bright">
              <Counter value={m.value} suffix={m.suffix} />
            </p>
          </HUDCard>
        ))}
      </div>

      <HUDCard title="BEHAVIOURAL ANOMALY SIGNALS - LAST 60 MINUTES">
        <AnomalyTimeline data={anomalyTimeline} />
      </HUDCard>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <HUDCard title="ACTIVE ALERTS FEED">
          <div className="max-h-80 space-y-3 overflow-auto pr-1">
            {alertFeed.map((item) => (
              <article key={item.timestamp + item.path} className="border border-tron-border bg-black/30 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <SeverityBadge severity={item.severity} />
                  <p className="text-xs text-tron-text">{item.timestamp}</p>
                </div>
                <p className="text-sm text-tron-text-bright">{item.attack}</p>
                <p className="text-xs text-tron-text">{item.path}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-tron-cyan">confidence {item.confidence}%</p>
              </article>
            ))}
          </div>
        </HUDCard>

        <HUDCard title="FUSION ENGINE DECISION">
          <div className="flex h-full items-center justify-center">
            <ThreatGauge value={78} label="Composite Threat" color="#ffaa00" />
          </div>
        </HUDCard>
      </div>
    </div>
  )
}
