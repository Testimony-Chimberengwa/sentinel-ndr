import { useMemo, useState } from 'react'
import AlertCard from '../components/alerts/AlertCard'
import HUDCard from '../components/ui/HUDCard'
import { useAlerts } from '../hooks/useAlerts'
import { useDevices } from '../hooks/useDevices'

export default function Alerts() {
  const { alerts } = useAlerts()
  const { devices } = useDevices()

  const [filters, setFilters] = useState({
    device: 'ALL',
    severity: 'ALL',
    status: 'ALL',
    attack: 'ALL',
  })

  const unreviewed = alerts.filter((a) => !a.acknowledged).length

  const counts = {
    CRITICAL: alerts.filter((a) => a.severity === 'CRITICAL').length,
    HIGH: alerts.filter((a) => a.severity === 'HIGH').length,
    MEDIUM: alerts.filter((a) => a.severity === 'MEDIUM').length,
    LOW: alerts.filter((a) => a.severity === 'LOW').length,
  }

  const filtered = useMemo(
    () =>
      alerts.filter((a) => {
        if (filters.device !== 'ALL' && a.deviceId !== filters.device) return false
        if (filters.severity !== 'ALL' && a.severity !== filters.severity) return false
        if (filters.status !== 'ALL' && a.investigationStatus !== filters.status) return false
        if (filters.attack !== 'ALL' && a.attackType !== filters.attack) return false
        return true
      }),
    [alerts, filters],
  )

  const update = (key) => (e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-tron-text-bright">SENTINEL ALERT CENTRE</h2>
        <span className="border border-tron-cyan px-3 py-2 text-xs uppercase tracking-[0.16em] text-tron-cyan">
          Unreviewed: {unreviewed}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <HUDCard><p className="text-tron-red">CRITICAL: {counts.CRITICAL}</p></HUDCard>
        <HUDCard><p className="text-orange-300">HIGH: {counts.HIGH}</p></HUDCard>
        <HUDCard><p className="text-tron-amber">MEDIUM: {counts.MEDIUM}</p></HUDCard>
        <HUDCard><p className="text-tron-cyan-dim">LOW: {counts.LOW}</p></HUDCard>
      </div>

      <HUDCard title="FILTERS">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
          <select onChange={update('device')} value={filters.device} className="hud-input">
            <option value="ALL">All Devices</option>
            {devices.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select onChange={update('severity')} value={filters.severity} className="hud-input">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((v) => <option key={v}>{v}</option>)}
          </select>
          <select onChange={update('attack')} value={filters.attack} className="hud-input">
            <option value="ALL">All Attack Types</option>
            {[...new Set(alerts.map((a) => a.attackType))].map((v) => <option key={v}>{v}</option>)}
          </select>
          <input className="hud-input" type="text" placeholder="Date range (mock)" />
          <select onChange={update('status')} value={filters.status} className="hud-input">
            {['ALL', 'OPEN', 'INVESTIGATING', 'CONCLUDED', 'CLOSED'].map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
      </HUDCard>

      <section className="space-y-3">
        {filtered.map((alert) => {
          const device = devices.find((d) => d.id === alert.deviceId)
          return <AlertCard key={alert.id} alert={alert} device={device} />
        })}
      </section>
    </div>
  )
}
