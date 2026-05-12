import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import AttackNarrative from '../components/alerts/AttackNarrative'
import FusionScoreBar from '../components/charts/FusionScoreBar'
import HUDCard from '../components/ui/HUDCard'
import TerminalPanel from '../components/ui/TerminalPanel'
import { getConnectionLog, getDeviceTimeline } from '../data/mockData'
import { useDevices } from '../hooks/useDevices'

export default function DeviceDrillDown() {
  const { deviceId } = useParams()
  const { getDeviceById } = useDevices()
  const [range, setRange] = useState('7d')
  const device = getDeviceById(deviceId)

  const timeline = useMemo(() => getDeviceTimeline(deviceId, range), [deviceId, range])
  const log = useMemo(() => getConnectionLog(deviceId), [deviceId])

  if (!device) {
    return <p className="text-tron-red">Device not found.</p>
  }

  const suspicious = device.id === 'vm-recon-lab' || device.id === 'vm-test-exfil'

  return (
    <div className="space-y-4">
      <HUDCard title="DEVICE IDENTITY">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-sm text-tron-text">
          <p><span className="text-tron-cyan">Name:</span> {device.name}</p>
          <p><span className="text-tron-cyan">IP:</span> {device.ip}</p>
          <p><span className="text-tron-cyan">MAC:</span> {device.mac}</p>
          <p><span className="text-tron-cyan">OS:</span> {device.os}</p>
          <p><span className="text-tron-cyan">Sensor:</span> {device.sensor}</p>
          <p><span className="text-tron-cyan">Days Monitored:</span> {device.daysMonitored}</p>
          <p><span className="text-tron-cyan">Threat:</span> {device.threatLevel}</p>
        </div>
      </HUDCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <HUDCard title="Total Connections (24h)"><p className="font-display text-3xl text-tron-text-bright">{device.metrics.totalConnections24h}</p></HUDCard>
        <HUDCard title="Unique Destination IPs"><p className="font-display text-3xl text-tron-text-bright">{device.metrics.uniqueDstIps}</p></HUDCard>
        <HUDCard title="Avg Bytes / Connection"><p className="font-display text-3xl text-tron-text-bright">{device.metrics.avgBytesPerConnection}</p></HUDCard>
        <HUDCard title="Suspicious Events"><p className="font-display text-3xl text-tron-text-bright">{device.metrics.suspiciousEvents}</p></HUDCard>
      </div>

      <HUDCard title="BEHAVIOURAL TIMELINE">
        <div className="mb-3 flex gap-2">
          {['24h', '7d', '30d'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`border px-3 py-1 text-xs uppercase tracking-[0.14em] ${range === r ? 'border-tron-cyan text-tron-cyan' : 'border-tron-border text-tron-text'}`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={timeline}>
              <CartesianGrid stroke="rgba(0,245,255,0.1)" />
              <XAxis dataKey="x" stroke="#7fa7a7" />
              <YAxis stroke="#7fa7a7" domain={[0, 1]} />
              <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #1a3a3a' }} />
              <Area type="monotone" dataKey="gmm" fill="rgba(0,245,255,0.15)" stroke="#00f5ff" />
              <Line type="monotone" dataKey="kde" stroke="#ff2020" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="lowess" stroke="#ffaa00" strokeDasharray="5 4" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <FusionScoreBar data={timeline} />
      </HUDCard>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <HUDCard title="CONNECTION LOG">
          <div className="max-h-96 overflow-auto">
            <table className="w-full min-w-[850px] text-left text-xs">
              <thead className="text-tron-cyan">
                <tr>
                  <th>Timestamp</th><th>Dst IP</th><th>Port</th><th>Protocol</th><th>Bytes Sent</th><th>Duration</th><th>Anomaly</th><th>Flag</th>
                </tr>
              </thead>
              <tbody>
                {log.map((row) => (
                  <tr key={row.id} className={`border-t border-tron-border ${row.flag === 'FLAGGED' ? 'bg-tron-red/10 text-tron-amber' : 'text-tron-text'}`}>
                    <td>{row.timestamp}</td><td>{row.dstIp}</td><td>{row.port}</td><td>{row.protocol}</td><td>{row.bytes}</td><td>{row.duration}</td><td>{row.anomaly}</td><td>{row.flag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </HUDCard>

        <HUDCard title="ATTACK NARRATIVE">
          <AttackNarrative
            steps={[
              '[Day 1] Baseline established. Normal SMB and DNS traffic.',
              '[Day 2] Minor GMM deviation (score: 0.18). Within threshold.',
              '[Day 3] KDE flags slight density shift in outbound connections.',
              '[Day 4] LOWESS detects upward gradient (+0.04/day).',
              '[Day 5] Fusion Engine escalates: correlated drift across all 3 layers.',
              suspicious
                ? '[Day 6] ALERT RAISED: Slow Reconnaissance confirmed. Confidence: 87%.'
                : '[Day 6] No escalation required. Behaviour remains inside adaptive envelope.',
            ]}
          />
        </HUDCard>
      </div>

      {(device.type === 'VM') && (
        <div className="grid gap-4 xl:grid-cols-[1fr_auto] items-end">
          <TerminalPanel
            title="PAYLOAD TEST CONSOLE"
            text={'$ sentinel --simulate slow-recon\n[ok] pacing engine: 4-hour interval\n[ok] payload bytes: low-volume mode\n[ok] jitter: enabled\n[warn] lowess trend rising\n[alert] fusion score approaching threshold'}
          />
          <div className="flex gap-2">
            <button className="border border-tron-cyan px-4 py-3 text-xs uppercase tracking-[0.18em] text-tron-cyan hover:bg-tron-cyan/10">RUN SIMULATION</button>
            <button className="border border-tron-red px-4 py-3 text-xs uppercase tracking-[0.18em] text-tron-red hover:bg-tron-red/10">RESET BASELINE</button>
          </div>
        </div>
      )}
    </div>
  )
}
