import { Link } from 'react-router-dom'
import SeverityBadge from '../ui/SeverityBadge'

export default function AlertCard({ alert, device }) {
  return (
    <article className="hud-card border border-tron-border bg-tron-panel/70 p-4">
      <div className="grid gap-3 md:grid-cols-[110px_140px_1fr_240px_220px_150px_130px_140px] md:items-center">
        <SeverityBadge severity={alert.severity} />
        <p className="font-display text-sm text-tron-text-bright">{alert.id}</p>
        <Link to={`/devices/${device.id}`} className="text-sm text-tron-text hover:text-tron-cyan">
          {device.name} ({device.ip})
        </Link>
        <p className="text-sm text-tron-text-bright">{alert.attackType}</p>
        <div>
          <div className="mb-1 flex justify-between text-[11px] uppercase tracking-[0.12em] text-tron-text">
            <span>Threat</span>
            <span>{alert.threat}%</span>
          </div>
          <div className="h-2 border border-tron-border">
            <div
              className="h-full"
              style={{
                width: `${alert.threat}%`,
                background: alert.threat > 80 ? '#ff2020' : alert.threat > 50 ? '#ffaa00' : '#00f5ff',
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1 text-[10px] uppercase tracking-[0.14em]">
          {['GMM', 'KDE', 'LOWESS', 'FUSION'].map((layer) => (
            <span
              key={layer}
              className={`border px-2 py-1 ${
                alert.layers.includes(layer)
                  ? 'border-tron-cyan text-tron-cyan'
                  : 'border-tron-border text-tron-text/50'
              }`}
            >
              {layer}
            </span>
          ))}
        </div>
        <p className="text-xs text-tron-text">{alert.duration}</p>
        <span className="inline-flex w-fit border border-tron-border px-2 py-1 text-xs uppercase tracking-[0.14em] text-tron-text-bright">
          {alert.status}
        </span>
      </div>
      <div className="mt-3 text-right">
        <Link
          to={`/alerts/${alert.id}`}
          className="inline-flex border border-tron-cyan px-3 py-2 text-xs uppercase tracking-[0.18em] text-tron-cyan hover:bg-tron-cyan/10"
        >
          INVESTIGATE {'=>'}
        </Link>
      </div>
    </article>
  )
}
