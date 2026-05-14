import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ToggleLeft, ToggleRight, X } from 'lucide-react'
import PatternOfLifeHeatmap from '../charts/PatternOfLifeHeatmap'
import HUDCard from '../ui/HUDCard'
import ThreatGauge from '../ui/ThreatGauge'
import { getConnectionLog, getPatternOfLifeHeatmap, getRemediationActions } from '../../data/mockData'
import { useAlerts } from '../../hooks/useAlerts'
import { useResponseActions } from '../../hooks/useResponseActions'

const scopeTabs = [
  { key: 'UNACKNOWLEDGED', label: 'UNACKNOWLEDGED' },
  { key: 'ALL', label: 'ALL' },
  { key: 'ACKNOWLEDGED', label: 'ACKNOWLEDGED' },
]

function valueTone(v) {
  return v >= 0.7 ? 'text-tron-amber' : 'text-tron-text-bright'
}

function formatUtc(ts) {
  return new Date(ts).toUTCString()
}

export default function AlertInvestigationPanel({ alert, device, onFilterByDevice, compact = false }) {
  const { alerts, markInvestigating, acknowledgeAlert, saveAlertNotes, concludeAlert, closeAlert, toggleModelDefeat } = useAlerts()
  const { queuePendingAction, activatePendingAction, reverseActionsForAlert } = useResponseActions()

  const [scope, setScope] = useState('ALL')
  const [notesDraft, setNotesDraft] = useState(alert?.investigationNotes || '')
  const [showDrawer, setShowDrawer] = useState(false)
  const [showConclude, setShowConclude] = useState(false)
  const [outcome, setOutcome] = useState('CONFIRMED THREAT')
  const [analyst, setAnalyst] = useState('analyst@sentinel.local')
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    setNotesDraft(alert?.investigationNotes || '')
  }, [alert?.id, alert?.investigationNotes])

  const deviceAlerts = useMemo(
    () => alerts.filter((item) => item.deviceId === device.id),
    [alerts, device.id],
  )

  const relatedAlerts = useMemo(() => {
    if (scope === 'ALL') return deviceAlerts
    if (scope === 'UNACKNOWLEDGED') return deviceAlerts.filter((item) => !item.acknowledged)
    return deviceAlerts.filter((item) => item.acknowledged)
  }, [deviceAlerts, scope])

  const connectionLog = useMemo(() => getConnectionLog(device.id), [device.id])
  const heatmap = useMemo(() => getPatternOfLifeHeatmap(device.id), [device.id])
  const actions = useMemo(() => getRemediationActions(alert.attackType), [alert.attackType])

  const prioritizedEvent = connectionLog.find((entry) => entry.flag === 'FLAGGED') || connectionLog[0]
  const rawEvidence = {
    srcIp: prioritizedEvent?.srcIp || device.ip,
    dstIp: prioritizedEvent?.dstIp || 'Unknown',
    port: prioritizedEvent?.port || '-',
    protocol: prioritizedEvent?.protocol || '-',
    bytes: prioritizedEvent?.bytes || '-',
    userAgent: prioritizedEvent?.userAgent || '-',
    uri: prioritizedEvent?.uri || '-',
    responseCode: prioritizedEvent?.responseCode || '-',
  }

  const timeline = useMemo(() => {
    const modelEvents = [
      {
        id: `${alert.id}-model`,
        timestamp: alert.raisedAt,
        title: `Device triggered model: ${alert.attackType}`,
        details: {
          'Primary layer': alert.layers?.[0] || 'FUSION',
          'Fusion score': `${alert.threat}%`,
        },
      },
      {
        id: `${alert.id}-fusion`,
        timestamp: alert.raisedAt,
        title: `Fusion score crossed threshold: ${alert.threat}%`,
        details: {
          'Threshold': '0.65',
          'Status': alert.investigationStatus,
        },
      },
    ]

    const connectionEvents = connectionLog.map((entry) => ({
      id: entry.id,
      timestamp: `${entry.timestamp}Z`,
      title: `Device connected to ${entry.dstIp} on port ${entry.port}`,
      details: entry,
    }))

    return [...modelEvents, ...connectionEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [alert.attackType, alert.id, alert.investigationStatus, alert.layers, alert.raisedAt, alert.threat, connectionLog])

  if (!alert || !device) return null

  const statusTone =
    alert.investigationStatus === 'CLOSED'
      ? 'border-tron-text text-tron-text'
      : alert.investigationStatus === 'CONCLUDED'
        ? 'border-tron-amber text-tron-amber'
        : alert.investigationStatus === 'INVESTIGATING'
          ? 'border-tron-cyan text-tron-cyan shadow-glow-cyan'
          : 'border-tron-red text-tron-red'

  const executeAction = (action) => {
    const pendingId = queuePendingAction({
      category: action.name.includes('DEVICE') ? 'DEVICE' : 'NETWORK',
      actionType: action.name,
      targetDeviceId: device.id,
      targetDeviceName: device.name,
      targetIp: device.ip,
      targetDescriptor: action.button.includes('IP') ? 'auto-selected endpoint' : undefined,
      scope: action.effort,
      triggeredByAlert: alert.id,
      initiatedBy: analyst,
    })
    activatePendingAction(pendingId)
    setShowDrawer(false)
  }

  const submitConclusion = () => {
    concludeAlert({ alertId: alert.id, outcome, analyst, notes: notesDraft })
    if (outcome === 'FALSE POSITIVE') {
      reverseActionsForAlert({ alertId: alert.id, reason: notesDraft || 'False positive confirmed' })
      toggleModelDefeat(alert.id)
    }
    if (outcome === 'RISK ACCEPTED') {
      closeAlert(alert.id, analyst)
    }
    setShowConclude(false)
  }

  return (
    <div className="space-y-4">
      <HUDCard title={compact ? 'DEVICE SUMMARY' : 'DEVICE IDENTITY BAR'}>
        <div className="grid gap-4 xl:grid-cols-[1fr_220px]">
          <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-3xl text-tron-text-bright">{device.name}</p>
                <p className="mt-1 text-sm text-tron-text">{device.ip}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`border px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${statusTone}`}>
                  {alert.investigationStatus}
                </span>
                <span className="border border-tron-cyan text-tron-cyan px-2 py-1 text-[10px] uppercase tracking-[0.16em]">{device.type || 'HOST'}</span>
                <span className={`border px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${alert.autonomousResponseActive ? 'border-tron-cyan text-tron-cyan' : 'border-tron-border text-tron-text'}`}>
                  SENTINEL AUTONOMOUS: {alert.autonomousResponseActive ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
            </div>

            <div className="grid gap-2 text-xs text-tron-text md:grid-cols-2 xl:grid-cols-3">
              <p>Hostname: <span className="text-tron-text-bright">{device.name.toLowerCase().replaceAll('-', '.')}</span></p>
              <p>Subnet: <span className="text-tron-text-bright">192.168.137.0/24</span></p>
              <p>Type: <span className="text-tron-text-bright">{device.type || 'Workstation'}</span></p>
              <p>OS: <span className="text-tron-text-bright">{device.os}</span></p>
              <p>IP: <span className="text-tron-text-bright">{device.ip}</span></p>
              <p>First seen: <span className="text-tron-text-bright">{formatUtc(device.lastSeen)}</span></p>
              <p>Last seen: <span className="text-tron-text-bright">{formatUtc(device.lastSeen)}</span></p>
              <p>MAC: <span className="text-tron-text-bright">{device.mac}</span></p>
              <p>Priority: <span className="text-tron-text-bright">{alert.severity || 'MEDIUM'}</span></p>
              <p>Active: <span className="text-tron-text-bright">{device.sensor !== 'SENSOR OFFLINE' ? 'YES' : 'NO'}</span></p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ThreatGauge value={alert.threat} size={220} label="Threat Confidence" color="#00f5ff" />
          </div>
        </div>
      </HUDCard>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <HUDCard title="EVENT DETAIL PANEL">
          <div className="space-y-4">
            <div>
              <p className="font-display text-2xl text-tron-text-bright">{alert.attackType}</p>
              <p className="mt-2 text-sm text-tron-text">{alert.summary}</p>
            </div>

            <div className="rounded border border-tron-border bg-black/30 p-3 font-mono text-[12px] leading-6 text-tron-text">
              <div className="grid gap-x-6 gap-y-1 md:grid-cols-2">
                {Object.entries(rawEvidence).map(([key, value]) => (
                  <p key={key}>
                    <span className="text-tron-cyan">{key}:</span> <span className={valueTone(String(value))}>{String(value)}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {scopeTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setScope(tab.key)}
                  className={`border px-3 py-2 text-[11px] uppercase tracking-[0.16em] ${scope === tab.key ? 'border-tron-cyan text-tron-cyan bg-tron-cyan/10' : 'border-tron-border text-tron-text'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {relatedAlerts.map((item) => (
                <article key={item.id} className={`border-l-2 p-3 ${item.acknowledged ? 'border-tron-cyan bg-black/20' : 'border-tron-amber bg-tron-amber/5'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.14em] text-tron-text">
                    <span>{item.id}</span>
                    <span>{item.acknowledged ? 'ACKNOWLEDGED' : 'UNACKNOWLEDGED'}</span>
                  </div>
                  <p className="mt-1 text-sm text-tron-text-bright">{item.attackType}</p>
                  <p className="text-xs text-tron-text">{item.investigationStatus} · {formatUtc(item.raisedAt)}</p>
                </article>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => markInvestigating(alert.id)} className="border border-tron-cyan px-4 py-2 text-xs uppercase tracking-[0.18em] text-tron-cyan hover:bg-tron-cyan/10">
                INVESTIGATE
              </button>
              <button type="button" onClick={() => acknowledgeAlert(alert.id)} className="border border-tron-cyan px-4 py-2 text-xs uppercase tracking-[0.18em] text-tron-cyan hover:bg-tron-cyan/10">
                ACKNOWLEDGE
              </button>
              <button type="button" onClick={() => setShowConclude(true)} className="border border-tron-amber px-4 py-2 text-xs uppercase tracking-[0.18em] text-tron-amber hover:bg-tron-amber/10">
                CONCLUDE INVESTIGATION
              </button>
              <button type="button" onClick={() => onFilterByDevice?.(device.id)} className="border border-tron-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-tron-text hover:bg-tron-panel/70">
                FILTER BY DEVICE
              </button>
              <button type="button" onClick={() => setShowDrawer(true)} className="border border-tron-cyan bg-tron-cyan/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-tron-cyan shadow-glow-cyan">
                LAUNCH RESPONSE ACTION
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => toggleModelDefeat(alert.id)} className={`flex items-center gap-2 border px-3 py-2 text-xs uppercase tracking-[0.16em] ${alert.modelDefeat ? 'border-tron-red text-tron-red' : 'border-tron-amber text-tron-amber'}`}>
                {alert.modelDefeat ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                Add Model Defeat
              </button>
              {alert.investigationStatus === 'CONCLUDED' ? (
                <button type="button" onClick={() => closeAlert(alert.id)} className="border border-tron-text px-3 py-2 text-xs uppercase tracking-[0.16em] text-tron-text hover:bg-tron-panel/70">
                  CLOSE INVESTIGATION
                </button>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-tron-cyan">Investigation Notes</label>
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={4}
                className="hud-input w-full"
                placeholder="Document triage findings, analyst judgment, and next actions..."
              />
              <div className="mt-2 flex justify-end">
                <button type="button" onClick={() => saveAlertNotes(alert.id, notesDraft)} className="border border-tron-cyan px-3 py-2 text-xs uppercase tracking-[0.16em] text-tron-cyan hover:bg-tron-cyan/10">
                  SAVE NOTES
                </button>
              </div>
            </div>

            {alert.concludedBy ? (
              <p className="text-xs uppercase tracking-[0.16em] text-tron-text">
                Concluded by {alert.concludedBy} at {alert.concludedAt ? formatUtc(alert.concludedAt) : '-'}
              </p>
            ) : null}
          </div>
        </HUDCard>

        <HUDCard title="BEHAVIOURAL METRIC GRAPH">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-tron-cyan">PATTERN OF LIFE HEATMAP</p>
          <PatternOfLifeHeatmap matrix={heatmap} />
        </HUDCard>
      </div>

      <HUDCard title="TIMELINE FEED">
        <div className="space-y-2">
          {timeline.map((entry) => {
            const isOpen = expanded[entry.id]
            return (
              <div key={entry.id} className="border border-tron-border bg-black/25 p-3">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 text-left"
                  onClick={() => setExpanded((current) => ({ ...current, [entry.id]: !current[entry.id] }))}
                >
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-tron-cyan">{formatUtc(entry.timestamp)}</p>
                    <p className="mt-1 text-sm text-tron-text-bright">{entry.title}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.16em] text-tron-text">{isOpen ? 'LESS' : 'MORE'}</span>
                </button>
                {isOpen ? (
                  <div className="mt-3 rounded border border-tron-border bg-tron-black/70 p-3 font-mono text-[12px] text-tron-text">
                    {Object.entries(entry.details || {}).map(([key, value]) => (
                      <p key={key} className="leading-6">
                        <span className="text-tron-cyan">{key}:</span> <span className={typeof value === 'number' || String(value).includes('FLAGGED') ? 'text-tron-amber' : 'text-tron-text-bright'}>{String(value)}</span>
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </HUDCard>

      {showDrawer ? (
        <div className="fixed inset-0 z-50 bg-black/70">
          <div className="absolute right-0 top-0 h-full w-full max-w-[520px] border-l border-tron-border bg-tron-dark p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl text-tron-text-bright">RESPONSE ACTIONS</h3>
              <button type="button" onClick={() => setShowDrawer(false)} className="text-tron-text hover:text-tron-cyan">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {actions.map((action) => (
                <article key={action.name} className="border border-tron-border bg-black/30 p-3">
                  <p className="font-display text-sm text-tron-cyan">{action.name}</p>
                  <p className="mt-2 text-sm text-tron-text">{action.description}</p>
                  <div className="mt-3 flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.16em] text-tron-text-bright">
                    <span>{action.effort}</span>
                    <span>{action.impact}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => executeAction(action)}
                    className="mt-4 w-full border border-tron-cyan bg-tron-cyan/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-tron-cyan shadow-glow-cyan hover:bg-tron-cyan/15"
                  >
                    EXECUTE
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {showConclude ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-2xl border border-tron-border bg-tron-dark p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-xl text-tron-text-bright">CONCLUDE INVESTIGATION</h3>
              <button type="button" onClick={() => setShowConclude(false)} className="text-tron-text hover:text-tron-cyan">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div className="grid gap-2 md:grid-cols-3">
                {['CONFIRMED THREAT', 'FALSE POSITIVE', 'RISK ACCEPTED'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setOutcome(option)}
                    className={`border px-3 py-2 text-xs uppercase tracking-[0.16em] ${outcome === option ? 'border-tron-cyan text-tron-cyan bg-tron-cyan/10' : 'border-tron-border text-tron-text'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input value={analyst} onChange={(e) => setAnalyst(e.target.value)} className="hud-input" placeholder="Analyst name or email" />
                <button type="button" onClick={() => setShowConclude(false)} className="border border-tron-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-tron-text hover:bg-tron-panel/70">
                  CANCEL
                </button>
              </div>
              <textarea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} rows={5} className="hud-input w-full" placeholder="Outcome notes and rationale" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={submitConclusion} className="border border-tron-amber px-4 py-2 text-xs uppercase tracking-[0.18em] text-tron-amber hover:bg-tron-amber/10">
                  SUBMIT OUTCOME
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}