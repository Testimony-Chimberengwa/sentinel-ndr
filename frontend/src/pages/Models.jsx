import { useMemo, useState } from 'react'
import { CheckCircle2, RefreshCw, ShieldAlert, ToggleLeft, ToggleRight } from 'lucide-react'
import HUDCard from '../components/ui/HUDCard'
import MiniSparkline from '../components/ui/MiniSparkline'
import { devices } from '../data/mockData'

const layerSeed = [
  {
    id: 'gmm',
    name: 'GMM ADAPTIVE BASELINE',
    status: 'ACTIVE',
    meanScore: 0.23,
    stdDev: 0.08,
    alerts: 47,
    defeats: 3,
    autonomous: true,
    lastRetrained: '3 days ago',
  },
  {
    id: 'kde',
    name: 'KDE GLOBAL DENSITY',
    status: 'ACTIVE',
    meanScore: 0.31,
    stdDev: 0.12,
    alerts: 52,
    defeats: 1,
    autonomous: true,
    lastRetrained: '3 days ago',
  },
  {
    id: 'lowess',
    name: 'LOWESS TREND MONITOR',
    status: 'TRAINING',
    meanScore: 0.19,
    stdDev: 0.04,
    alerts: 61,
    defeats: 0,
    autonomous: false,
    lastRetrained: 'running continuously',
  },
  {
    id: 'fusion',
    name: 'HDT FUSION ENGINE',
    status: 'DEGRADED',
    meanScore: 0.47,
    stdDev: 0.09,
    alerts: 38,
    defeats: 2,
    autonomous: true,
    lastRetrained: '5 days ago',
  },
]

const attackProfiles = [
  {
    name: 'Slow Reconnaissance',
    detections: 28,
    meanDay: 4.2,
    fpr: 8.1,
    layer: 'LOWESS',
    fusion: 0.68,
    status: 'ACTIVE MONITORING',
    tone: 'good',
    history: [3, 4, 2, 5, 4, 6, 5, 7, 6, 7, 8, 8],
  },
  {
    name: 'Gradual Exfiltration',
    detections: 19,
    meanDay: 8.6,
    fpr: 3.2,
    layer: 'FUSION',
    fusion: 0.81,
    status: 'ACTIVE MONITORING',
    tone: 'good',
    history: [1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5],
  },
  {
    name: 'C2 Beaconing',
    detections: 16,
    meanDay: 6.9,
    fpr: 11.4,
    layer: 'KDE',
    fusion: 0.59,
    status: 'NEEDS CALIBRATION',
    tone: 'amber',
    history: [2, 2, 1, 2, 3, 2, 4, 4, 4, 5, 5, 6],
  },
  {
    name: 'Privilege Escalation',
    detections: 9,
    meanDay: 11.3,
    fpr: 14.7,
    layer: 'GMM',
    fusion: 0.54,
    status: 'NEEDS CALIBRATION',
    tone: 'red',
    history: [0, 1, 1, 1, 2, 1, 2, 2, 2, 3, 3, 4],
  },
]

const breachSeed = [
  {
    id: 'BR-0101',
    device: 'VM-TEST-EXFIL',
    timestamp: '2026-05-14T07:42:00Z',
    gmm: 0.42,
    kde: 0.58,
    lowess: 0.79,
    fusion: 0.67,
    alertRaised: true,
    acknowledged: false,
    modelDefeat: false,
  },
  {
    id: 'BR-0100',
    device: 'VM-RECON-LAB',
    timestamp: '2026-05-13T22:11:00Z',
    gmm: 0.35,
    kde: 0.29,
    lowess: 0.74,
    fusion: 0.66,
    alertRaised: true,
    acknowledged: true,
    modelDefeat: false,
  },
  {
    id: 'BR-0098',
    device: 'LAPTOP-DEV-01',
    timestamp: '2026-05-13T13:08:00Z',
    gmm: 0.18,
    kde: 0.61,
    lowess: 0.52,
    fusion: 0.71,
    alertRaised: true,
    acknowledged: false,
    modelDefeat: true,
  },
  {
    id: 'BR-0097',
    device: 'SERVER-DB-PRIMARY',
    timestamp: '2026-05-12T18:54:00Z',
    gmm: 0.24,
    kde: 0.33,
    lowess: 0.44,
    fusion: 0.64,
    alertRaised: false,
    acknowledged: true,
    modelDefeat: false,
  },
]

const formatScore = (value) => value.toFixed(2)

const formatPercent = (value) => `${value.toFixed(1)}%`

const layerTone = {
  ACTIVE: 'border-tron-cyan text-tron-cyan shadow-glow-cyan',
  TRAINING: 'border-tron-amber text-tron-amber',
  DEGRADED: 'border-tron-red text-tron-red',
}

const rowTone = {
  good: 'border-l-tron-cyan bg-tron-cyan/5',
  amber: 'border-l-tron-amber bg-tron-amber/10',
  red: 'border-l-tron-red bg-tron-red/10',
}

const coldStartTone = {
  COMPLETE: 'border-tron-cyan text-tron-cyan',
  'IN PROGRESS': 'border-tron-amber text-tron-amber',
}

const deviceSeed = devices.map((device, index) => ({
  ...device,
  baselineAge: [18, 41, 59, 32, 12, 87, 24][index] ?? 22,
  stability: [0.91, 0.88, 0.96, 0.79, 0.74, 0.69, 0.84][index] ?? 0.8,
  coldStart: index % 4 === 0 ? 'IN PROGRESS' : 'COMPLETE',
  coldStartProgress: index % 4 === 0 ? 63 : 100,
  retraining: false,
}))

function scoreClass(score) {
  if (score < 0.3) return 'text-tron-cyan'
  if (score < 0.6) return 'text-tron-amber'
  return 'text-tron-red'
}

function statusClass(status) {
  if (status === 'ACTIVE MONITORING') return 'border-tron-cyan text-tron-cyan'
  return 'border-tron-amber text-tron-amber'
}

function deviceName(device) {
  return `${device.name} · ${device.ip}`
}

function BreachSparkline({ values }) {
  return <MiniSparkline values={values} />
}

export default function Models() {
  const [layers, setLayers] = useState(layerSeed)
  const [devicesState, setDevicesState] = useState(deviceSeed)
  const [breaches, setBreaches] = useState(breachSeed)
  const [retrainBusy, setRetrainBusy] = useState(null)

  const precision = useMemo(() => {
    const falsePositives = breaches.filter((breach) => breach.modelDefeat).length
    const totalConfirmed = breaches.filter((breach) => breach.alertRaised).length
    return totalConfirmed ? ((totalConfirmed - falsePositives) / totalConfirmed) * 100 : 100
  }, [breaches])

  const orderedDevices = useMemo(() => [...devicesState].sort((a, b) => b.stability - a.stability), [devicesState])

  const updateLayerToggle = (layerId) => {
    setLayers((current) => current.map((layer) => (layer.id === layerId ? { ...layer, autonomous: !layer.autonomous } : layer)))
  }

  const retrainDevice = async (deviceId) => {
    const target = devicesState.find((device) => device.id === deviceId)
    if (!target) return

    const confirmed = window.confirm(
      `This will reset 72hr baseline collection for ${target.name}. Detection will be reduced during this period.`,
    )
    if (!confirmed) return

    setRetrainBusy(deviceId)
    setDevicesState((current) =>
      current.map((device) =>
        device.id === deviceId
          ? { ...device, coldStart: 'IN PROGRESS', coldStartProgress: 0, retraining: true, baselineAge: 0 }
          : device,
      ),
    )

    try {
      await fetch('/api/baseline/retrain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      })
    } catch {
      // Mock-only app: keep the local state update even if the API is unavailable.
    } finally {
      setTimeout(() => {
        setDevicesState((current) =>
          current.map((device) => (device.id === deviceId ? { ...device, retraining: false, coldStartProgress: 18 } : device)),
        )
        setRetrainBusy(null)
      }, 1200)
    }
  }

  const acknowledgeBreach = (breachId) => {
    setBreaches((current) => current.map((breach) => (breach.id === breachId ? { ...breach, acknowledged: true } : breach)))
  }

  const toggleModelDefeat = (breachId) => {
    setBreaches((current) =>
      current.map((breach) =>
        breach.id === breachId
          ? {
              ...breach,
              modelDefeat: !breach.modelDefeat,
            }
          : breach,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-tron-cyan">MODEL HEALTH</p>
          <h2 className="font-display text-2xl text-tron-text-bright">HDT DETECTION ENGINE — MODEL HEALTH</h2>
        </div>
        <div className="border border-tron-border bg-tron-dark/70 px-3 py-2 text-xs uppercase tracking-[0.16em] text-tron-text">
          Fusion precision {formatPercent(precision)} over the last 30 days
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        {layers.map((layer) => (
          <HUDCard key={layer.id} className="h-full">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg text-tron-text-bright">{layer.name}</p>
                <span className={`mt-2 inline-flex border px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${layerTone[layer.status]}`}>
                  {layer.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateLayerToggle(layer.id)}
                className={`flex items-center gap-2 border px-3 py-2 text-[11px] uppercase tracking-[0.16em] ${
                  layer.autonomous ? 'border-tron-cyan text-tron-cyan' : 'border-tron-border text-tron-text'
                }`}
              >
                {layer.autonomous ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                {layer.autonomous ? 'AUTO ON' : 'AUTO OFF'}
              </button>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-tron-text md:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-tron-cyan">Mean anomaly score</p>
                <p className={`mt-1 font-display text-2xl ${scoreClass(layer.meanScore)}`}>{formatScore(layer.meanScore)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-tron-cyan">Standard deviation</p>
                <p className="mt-1 font-display text-2xl text-tron-text-bright">{formatScore(layer.stdDev)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-tron-cyan">Alerts contributed</p>
                <p className="mt-1 font-display text-2xl text-tron-text-bright">{layer.alerts}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-tron-cyan">Model defeats</p>
                <p className="mt-1 font-display text-2xl text-tron-text-bright">{layer.defeats}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-tron-border pt-3 text-xs uppercase tracking-[0.14em] text-tron-text">
              <span>Last retrained</span>
              <span>{layer.lastRetrained}</span>
            </div>
          </HUDCard>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <HUDCard title="ATTACK PROFILE PERFORMANCE TABLE" className="overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full min-w-[1080px] text-left text-xs">
              <thead className="text-tron-cyan">
                <tr>
                  <th className="pb-3 pr-3">Attack Profile</th>
                  <th className="pb-3 pr-3">Detections</th>
                  <th className="pb-3 pr-3">Mean detection day</th>
                  <th className="pb-3 pr-3">False positive rate</th>
                  <th className="pb-3 pr-3">Primary layer</th>
                  <th className="pb-3 pr-3">Avg fusion score</th>
                  <th className="pb-3 pr-3">Trend</th>
                  <th className="pb-3 pr-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {attackProfiles.map((profile) => (
                  <tr key={profile.name} className={`border-t border-tron-border ${rowTone[profile.tone]}`}>
                    <td className="py-3 pr-3 text-sm text-tron-text-bright">{profile.name}</td>
                    <td className="py-3 pr-3 text-tron-text">{profile.detections}</td>
                    <td className="py-3 pr-3 text-tron-text">{profile.meanDay.toFixed(1)} days</td>
                    <td className="py-3 pr-3 text-tron-text">{formatPercent(profile.fpr)}</td>
                    <td className="py-3 pr-3 text-tron-text">{profile.layer}</td>
                    <td className="py-3 pr-3 text-tron-text">{formatScore(profile.fusion)}</td>
                    <td className="py-3 pr-3">
                      <div className="w-40">
                        <BreachSparkline values={profile.history} />
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <span className={`inline-flex border px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${statusClass(profile.status)}`}>
                        {profile.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </HUDCard>

        <HUDCard title="BASELINE HEALTH PER DEVICE">
          <div className="space-y-3">
            {orderedDevices.map((device) => (
              <div key={device.id} className="border border-tron-border bg-black/25 p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg text-tron-text-bright">{deviceName(device)}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-tron-text">Baseline age {device.baselineAge} days</p>
                  </div>
                  <span className={`border px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${coldStartTone[device.coldStart]}`}>
                    {device.coldStart}
                  </span>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-[1fr_220px] md:items-center">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-tron-cyan">
                      <span>Baseline stability</span>
                      <span>{formatScore(device.stability)}</span>
                    </div>
                    <div className="h-2 border border-tron-border bg-black/40">
                      <div
                        className="h-full bg-tron-cyan shadow-glow-cyan"
                        style={{ width: `${Math.max(8, Math.min(100, device.stability * 100))}%` }}
                      />
                    </div>
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-tron-text">
                        <span>Cold start progress</span>
                        <span>{device.coldStartProgress}%</span>
                      </div>
                      <div className="h-2 border border-tron-border bg-black/40">
                        <div className="h-full bg-tron-amber" style={{ width: `${device.coldStartProgress}%` }} />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => retrainDevice(device.id)}
                    disabled={retrainBusy === device.id}
                    className="inline-flex items-center justify-center gap-2 border border-tron-amber px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-tron-amber hover:bg-tron-amber/10 disabled:cursor-wait disabled:opacity-60"
                  >
                    <RefreshCw size={14} className={retrainBusy === device.id ? 'animate-spin' : ''} />
                    {retrainBusy === device.id ? 'RETRAINING' : 'RETRAIN BASELINE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </HUDCard>
      </div>

      <HUDCard title="MODEL BREACH LOG">
        <div className="overflow-auto">
          <table className="w-full min-w-[1240px] text-left text-xs">
            <thead className="text-tron-cyan">
              <tr>
                <th className="pb-3 pr-3">Breach ID</th>
                <th className="pb-3 pr-3">Device</th>
                <th className="pb-3 pr-3">Timestamp</th>
                <th className="pb-3 pr-3">GMM at breach</th>
                <th className="pb-3 pr-3">KDE at breach</th>
                <th className="pb-3 pr-3">LOWESS at breach</th>
                <th className="pb-3 pr-3">Fusion score</th>
                <th className="pb-3 pr-3">Alert raised?</th>
                <th className="pb-3 pr-3">Acknowledged?</th>
                <th className="pb-3 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {breaches.map((breach) => (
                <tr
                  key={breach.id}
                  className={`border-t border-tron-border ${!breach.acknowledged ? 'bg-tron-amber/10' : 'bg-transparent'} ${
                    breach.modelDefeat ? 'ring-1 ring-tron-red/40' : ''
                  }`}
                >
                  <td className="py-3 pr-3 text-sm text-tron-text-bright">{breach.id}</td>
                  <td className="py-3 pr-3 text-tron-text">{breach.device}</td>
                  <td className="py-3 pr-3 text-tron-text">{new Date(breach.timestamp).toUTCString()}</td>
                  <td className="py-3 pr-3 text-tron-text">{formatScore(breach.gmm)}</td>
                  <td className="py-3 pr-3 text-tron-text">{formatScore(breach.kde)}</td>
                  <td className="py-3 pr-3 text-tron-text">{formatScore(breach.lowess)}</td>
                  <td className="py-3 pr-3 text-tron-text">{formatScore(breach.fusion)}</td>
                  <td className="py-3 pr-3 text-tron-text">{breach.alertRaised ? 'YES' : 'NO'}</td>
                  <td className="py-3 pr-3 text-tron-text">{breach.acknowledged ? 'YES' : 'NO'}</td>
                  <td className="py-3 pr-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => acknowledgeBreach(breach.id)}
                        className="inline-flex items-center gap-1 border border-tron-cyan px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-tron-cyan hover:bg-tron-cyan/10"
                      >
                        <CheckCircle2 size={13} />
                        Acknowledge
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleModelDefeat(breach.id)}
                        className={`inline-flex items-center gap-1 border px-3 py-2 text-[10px] uppercase tracking-[0.16em] ${
                          breach.modelDefeat ? 'border-tron-red text-tron-red bg-tron-red/10' : 'border-tron-amber text-tron-amber'
                        }`}
                      >
                        <ShieldAlert size={13} />
                        {breach.modelDefeat ? 'Defeat recorded' : 'Add Model Defeat'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </HUDCard>
    </div>
  )
}