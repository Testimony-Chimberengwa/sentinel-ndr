import { Link } from 'react-router-dom'
import HUDCard from '../components/ui/HUDCard'
import MiniSparkline from '../components/ui/MiniSparkline'
import { useDevices } from '../hooks/useDevices'
import { useResponseActions } from '../hooks/useResponseActions'

const levelClass = {
  CLEAN: 'border-tron-cyan-dim text-tron-cyan-dim',
  SUSPICIOUS: 'border-tron-amber text-tron-amber',
  COMPROMISED: 'border-tron-red text-tron-red',
  CONTAINED: 'border-tron-cyan text-tron-cyan',
}

const sensorClass = {
  'SENSOR ACTIVE': 'border-tron-cyan text-tron-cyan',
  'SENSOR OFFLINE': 'border-tron-red text-tron-red',
  UNMONITORED: 'border-tron-border text-tron-text',
}

export default function Devices() {
  const { devices } = useDevices()
  const { actions, deviceActiveCounts } = useResponseActions()

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-tron-text-bright">DEVICE INVENTORY</h2>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {devices.map((d) => (
          (() => {
            const contained = actions.some(
              (a) => a.targetDeviceId === d.id && a.actionType.includes('QUARANTINE') && a.status === 'ACTIVE',
            )
            const effectiveThreat = contained ? 'CONTAINED' : d.threatLevel
            return (
          <HUDCard key={d.id}>
            <div className="flex items-start justify-between">
              <p className="font-display text-lg text-tron-text-bright">{d.name}</p>
              <span className={`border px-2 py-1 text-[10px] uppercase tracking-[0.15em] ${sensorClass[d.sensor] || sensorClass.UNMONITORED}`}>
                {d.sensor}
              </span>
            </div>
            <div className="mt-2 space-y-1 text-xs text-tron-text">
              <p>IP: {d.ip}</p>
              <p>MAC: {d.mac}</p>
              <p>OS: {d.os}</p>
              <p>Last Seen: {new Date(d.lastSeen).toUTCString()}</p>
            </div>
            <div className="mt-3">
              <MiniSparkline values={d.miniFusion} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={`border px-2 py-1 text-[10px] uppercase tracking-[0.15em] ${levelClass[effectiveThreat]}`}>
                {effectiveThreat}
              </span>
              {deviceActiveCounts[d.id] ? (
                <Link
                  to={`/response-actions?device=${encodeURIComponent(d.name)}&status=active`}
                  className="border border-tron-cyan px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-tron-cyan hover:bg-tron-cyan/10"
                >
                  ACTIONS ACTIVE: {deviceActiveCounts[d.id]}
                </Link>
              ) : null}
              <Link to={`/devices/${d.id}`} className="border border-tron-cyan px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-tron-cyan hover:bg-tron-cyan/10">
                DRILL DOWN {'=>'}
              </Link>
            </div>
          </HUDCard>
            )
          })()
        ))}
      </div>
    </div>
  )
}
