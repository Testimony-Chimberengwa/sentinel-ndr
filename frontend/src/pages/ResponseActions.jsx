import { Ban, Clock3, Eye, ShieldAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import HUDCard from '../components/ui/HUDCard'
import { useResponseActions } from '../hooks/useResponseActions'

const topTabs = [
  { key: 'network', label: 'NETWORK ACTIONS' },
  { key: 'device', label: 'DEVICE ACTIONS' },
  { key: 'history', label: 'ACTION HISTORY' },
]

const statusTabs = [
  { key: 'PENDING', label: 'PENDING', tone: 'text-tron-amber border-tron-amber' },
  { key: 'ACTIVE', label: 'ACTIVE', tone: 'text-tron-cyan border-tron-cyan shadow-glow-cyan' },
  { key: 'REVERSED', label: 'REVERSED', tone: 'text-tron-text border-tron-border' },
  { key: 'EXPIRED', label: 'EXPIRED', tone: 'text-tron-text border-tron-border opacity-80' },
]

const iconForAction = (actionType) => {
  if (actionType.includes('QUARANTINE')) return ShieldAlert
  if (actionType.includes('BLOCK')) return Ban
  if (actionType.includes('RATE')) return Clock3
  return Eye
}

function formatDuration(ms) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60_000))
  const d = Math.floor(totalMinutes / (60 * 24))
  const h = Math.floor((totalMinutes % (60 * 24)) / 60)
  const m = totalMinutes % 60
  return `${d}d ${h}h ${m}m`
}

function escapeCsv(v) {
  const text = String(v ?? '')
  return `"${text.replaceAll('"', '""')}"`
}

const reversalReasons = [
  'False positive confirmed',
  'Investigation concluded - threat neutralised',
  'Device needed for operations',
  'Manual override by analyst',
]

function reversalDescription(action) {
  if (action.actionType.includes('QUARANTINE')) {
    return `This will lift the quarantine on ${action.targetDeviceName} and restore full network access.`
  }
  if (action.actionType.includes('IP BLOCK')) {
    return `This will remove ${action.targetDescriptor || 'the destination IP'} from blocklist.`
  }
  if (action.actionType.includes('PATTERN OF LIFE')) {
    return 'This will remove traffic restrictions.'
  }
  if (action.actionType.includes('RATE')) {
    return 'This will restore normal connection rate.'
  }
  if (action.actionType.includes('DNS SINKHOLE')) {
    return 'This will restore normal DNS resolution.'
  }
  if (action.actionType.includes('PACKET CAPTURE') || action.actionType.includes('CAPTURE')) {
    return 'This will stop packet capture.'
  }
  return `This will undo ${action.actionType}.`
}

export default function ResponseActions() {
  const { actions, activeEnforcedCount, reverseAction, extendAction, activatePendingAction, reEnforceAction } = useResponseActions()

  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('device') || '')
  const [topTab, setTopTab] = useState('network')
  const [statusTab, setStatusTab] = useState(searchParams.get('status')?.toUpperCase() || 'ACTIVE')
  const [now, setNow] = useState(Date.now())
  const [reverseDraft, setReverseDraft] = useState({ actionId: null, reason: '' })
  const [extendDraft, setExtendDraft] = useState({ actionId: null, minutes: 1440 })
  const [toast, setToast] = useState('')

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const scoped = useMemo(() => {
    const currentCategory = topTab === 'device' ? 'DEVICE' : 'NETWORK'
    return actions
      .filter((a) => a.category === currentCategory)
      .filter((a) => {
        const hay = `${a.actionType} ${a.targetDeviceName} ${a.targetIp} ${a.targetDescriptor || ''}`.toLowerCase()
        return query.trim() ? hay.includes(query.toLowerCase()) : true
      })
  }, [actions, query, topTab])

  const scopedCounts = useMemo(
    () =>
      statusTabs.reduce((acc, s) => {
        acc[s.key] = scoped.filter((a) => a.status === s.key).length
        return acc
      }, {}),
    [scoped],
  )

  const visibleCards = useMemo(() => scoped.filter((a) => a.status === statusTab), [scoped, statusTab])

  const historyRows = useMemo(
    () => [...actions].sort((a, b) => new Date(b.initiatedAt).getTime() - new Date(a.initiatedAt).getTime()),
    [actions],
  )

  const exportCsv = () => {
    const header = ['Timestamp', 'Action', 'Device', 'Triggered By', 'Duration', 'Reversed?', 'Reversal Reason']

    const lines = historyRows.map((row) => {
      const started = row.enforcedAt ? new Date(row.enforcedAt).getTime() : new Date(row.initiatedAt).getTime()
      const ended = row.reversedAt ? new Date(row.reversedAt).getTime() : now
      return [
        new Date(row.initiatedAt).toUTCString(),
        row.targetDescriptor ? `${row.actionType} (${row.targetDescriptor})` : row.actionType,
        `${row.targetDeviceName} (${row.targetIp})`,
        row.initiatedBy,
        formatDuration(ended - started),
        row.status === 'REVERSED' ? 'yes' : 'no',
        row.reversalReason || '',
      ]
    })

    const csv = [header.map(escapeCsv).join(','), ...lines.map((line) => line.map(escapeCsv).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sentinel-response-actions-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-tron-text-bright">SENTINEL RESPONSE CENTRE</h2>
        <span className="border border-tron-cyan bg-tron-cyan/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-tron-cyan shadow-glow-cyan">
          ACTIVE ENFORCED ACTIONS: {activeEnforcedCount}
        </span>
      </header>

      <div className="flex flex-wrap gap-2">
        {topTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setTopTab(tab.key)}
            className={`border px-4 py-2 text-xs uppercase tracking-[0.18em] ${topTab === tab.key ? 'border-tron-cyan bg-tron-cyan/10 text-tron-cyan' : 'border-tron-border text-tron-text'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {topTab !== 'history' ? (
        <>
          <HUDCard title="FILTER ACTIONS">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                value={query}
                onChange={(e) => {
                  const value = e.target.value
                  setQuery(value)
                  if (value) {
                    setSearchParams((prev) => {
                      prev.set('device', value)
                      return prev
                    })
                  }
                }}
                placeholder="Search device name, IP, or action type"
                className="hud-input"
              />
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setSearchParams({})
                }}
                className="border border-tron-border px-4 py-2 text-xs uppercase tracking-[0.16em] text-tron-text hover:bg-tron-panel/70"
              >
                CLEAR
              </button>
            </div>
          </HUDCard>

          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusTab(tab.key)}
                className={`border px-3 py-2 text-xs uppercase tracking-[0.16em] ${tab.tone} ${statusTab === tab.key ? 'bg-black/30' : ''}`}
              >
                {tab.label} ({scopedCounts[tab.key] || 0})
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {visibleCards.map((action) => {
              const Icon = iconForAction(action.actionType)
              const started = action.enforcedAt ? new Date(action.enforcedAt).getTime() : new Date(action.initiatedAt).getTime()
              const elapsedMs = now - started
              const expiryMs = action.expiresAt ? new Date(action.expiresAt).getTime() - now : null
              const dangerExpiry = expiryMs !== null && expiryMs <= 60 * 60 * 1000
              const deviceQuarantined = actions.some(
                (a) =>
                  a.targetDeviceId === action.targetDeviceId && a.actionType === 'DEVICE QUARANTINE' && a.status === 'ACTIVE',
              )

              return (
                <HUDCard key={action.id}>
                  <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr_1fr]">
                    <div className="space-y-2 text-sm text-tron-text">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center border border-tron-border bg-black/40 text-tron-cyan">
                          <Icon size={18} />
                        </div>
                        <p className="font-display text-lg text-tron-text-bright">{action.actionType}</p>
                      </div>
                      <p>
                        {action.targetDeviceName} ({action.targetIp})
                      </p>
                      <p>
                        Triggered by:{' '}
                        <Link className="text-tron-cyan underline" to={`/alerts/${action.triggeredByAlert}`}>
                          {action.triggeredByAlert}
                        </Link>
                      </p>
                      <p>Triggered at: {new Date(action.initiatedAt).toUTCString()}</p>
                      <p>
                        Initiated by:{' '}
                        <span
                          className={`border px-2 py-1 text-[10px] uppercase tracking-[0.15em] ${action.initiatedBy === 'ANALYST' ? 'border-tron-amber text-tron-amber' : 'border-tron-cyan text-tron-cyan'}`}
                        >
                          {action.initiatedBy}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div
                        className={`octagon border p-4 text-center ${action.status === 'ACTIVE' ? 'animate-pulse border-tron-cyan text-tron-cyan shadow-glow-cyan' : action.status === 'PENDING' ? 'animate-pulse border-tron-amber text-tron-amber' : action.status === 'REVERSED' ? 'border-tron-border text-tron-text' : 'border-tron-red bg-tron-red/10 text-tron-red/70'}`}
                      >
                        <p className="font-display text-sm tracking-[0.14em]">{action.status}</p>
                      </div>
                      <p className="text-xs text-tron-text">
                        Enforced for: <span className="text-tron-text-bright">{formatDuration(elapsedMs)}</span>
                      </p>
                      <p className={`text-xs ${dangerExpiry ? 'text-tron-red' : 'text-tron-text'}`}>
                        Expires in:{' '}
                        <span className="text-tron-text-bright">
                          {expiryMs === null ? 'No expiry' : formatDuration(expiryMs)}
                        </span>
                      </p>
                      <p className="text-xs text-tron-text">
                        Scope: <span className="text-tron-cyan">{action.scope}</span>
                      </p>
                      <p className="text-xs text-tron-text">
                        Device status:{' '}
                        <span className={deviceQuarantined ? 'text-tron-amber' : 'text-tron-cyan'}>
                          {deviceQuarantined ? 'QUARANTINED' : 'UNQUARANTINED'}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={action.status === 'REVERSED' || action.status === 'EXPIRED'}
                          onClick={() => setReverseDraft({ actionId: action.id, reason: '' })}
                          className="w-full border border-tron-red px-3 py-2 text-xs uppercase tracking-[0.16em] text-tron-red shadow-glow-red hover:bg-tron-red/10 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          ↩ REVERSE ACTION
                        </button>
                        <button
                          type="button"
                          onClick={() => setExtendDraft({ actionId: action.id, minutes: action.actionType.includes('CAPTURE') ? 60 : 1440 })}
                          className="w-full border border-tron-cyan px-3 py-2 text-xs uppercase tracking-[0.16em] text-tron-cyan shadow-glow-cyan hover:bg-tron-cyan/10"
                        >
                          + EXTEND 24H
                        </button>
                      </div>

                      {action.status === 'REVERSED' ? (
                        <button
                          type="button"
                          onClick={() => {
                            reEnforceAction(action.id)
                            setStatusTab('ACTIVE')
                          }}
                          className="w-full border border-tron-amber px-4 py-2 text-xs uppercase tracking-[0.16em] text-tron-amber hover:bg-tron-amber/10"
                        >
                          RE-ENFORCE
                        </button>
                      ) : null}

                      {action.status === 'PENDING' ? (
                        <button
                          type="button"
                          onClick={() => activatePendingAction(action.id)}
                          className="w-full border border-tron-amber px-4 py-2 text-xs uppercase tracking-[0.16em] text-tron-amber hover:bg-tron-amber/10"
                        >
                          ENFORCE NOW
                        </button>
                      ) : null}

                      <div className="space-y-2 border-t border-tron-border pt-2 text-xs">
                        <Link to={`/alerts/${action.triggeredByAlert}`} className="block text-tron-cyan underline">
                          View Alert
                        </Link>
                        <Link to={`/devices/${action.targetDeviceId}`} className="block text-tron-cyan underline">
                          View Device
                        </Link>
                      </div>
                    </div>
                  </div>
                </HUDCard>
              )
            })}

            {!visibleCards.length ? (
              <HUDCard>
                <p className="text-sm text-tron-text">No actions in this state.</p>
              </HUDCard>
            ) : null}
          </div>
        </>
      ) : (
        <HUDCard title="ACTION HISTORY">
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={exportCsv}
              className="border border-tron-cyan px-4 py-2 text-xs uppercase tracking-[0.16em] text-tron-cyan hover:bg-tron-cyan/10"
            >
              EXPORT LOG
            </button>
          </div>
          <div className="overflow-auto">
            <table className="w-full min-w-[980px] text-left text-xs">
              <thead className="text-tron-cyan">
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Device</th>
                  <th>Triggered By</th>
                  <th>Duration</th>
                  <th>Reversed?</th>
                  <th>Reversal Reason</th>
                </tr>
              </thead>
              <tbody>
                {historyRows.map((row) => {
                  const started = row.enforcedAt ? new Date(row.enforcedAt).getTime() : new Date(row.initiatedAt).getTime()
                  const ended = row.reversedAt ? new Date(row.reversedAt).getTime() : now
                  return (
                    <tr key={row.id} className="border-t border-tron-border text-tron-text">
                      <td>{new Date(row.initiatedAt).toUTCString()}</td>
                      <td>{row.targetDescriptor ? `${row.actionType} (${row.targetDescriptor})` : row.actionType}</td>
                      <td>
                        {row.targetDeviceName} ({row.targetIp})
                      </td>
                      <td>{row.initiatedBy}</td>
                      <td>{formatDuration(ended - started)}</td>
                      <td>{row.status === 'REVERSED' ? 'yes' : 'no'}</td>
                      <td>{row.reversalReason || '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </HUDCard>
      )}

      {reverseDraft.actionId ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-2xl border border-tron-border bg-tron-panel p-5">
            <h3 className="font-display text-xl text-tron-text-bright">CONFIRM ACTION REVERSAL</h3>
            {(() => {
              const selected = actions.find((a) => a.id === reverseDraft.actionId)
              if (!selected) return null
              return (
                <>
                  <p className="mt-3 text-sm text-tron-text">
                    {reversalDescription(selected)}
                  </p>
                  <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-tron-cyan">
                    Reason for reversal (required)
                  </label>
                  <select
                    value={reverseDraft.reason}
                    onChange={(e) => setReverseDraft((prev) => ({ ...prev, reason: e.target.value }))}
                    className="hud-input mt-2 w-full"
                  >
                    <option value="">Select reason...</option>
                    {reversalReasons.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      disabled={!reverseDraft.reason.trim()}
                      onClick={() => {
                        reverseAction({ actionId: selected.id, reason: reverseDraft.reason.trim() })
                        setReverseDraft({ actionId: null, reason: '' })
                        setStatusTab('REVERSED')
                        setToast('ACTION REVERSED')
                        setTimeout(() => setToast(''), 2200)
                      }}
                      className="border border-tron-red px-4 py-2 text-xs uppercase tracking-[0.16em] text-tron-red shadow-glow-red disabled:opacity-40"
                    >
                      CONFIRM REVERSAL
                    </button>
                    <button
                      type="button"
                      onClick={() => setReverseDraft({ actionId: null, reason: '' })}
                      className="border border-tron-border px-4 py-2 text-xs uppercase tracking-[0.16em] text-tron-text"
                    >
                      CANCEL
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      ) : null}

      {extendDraft.actionId ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-lg border border-tron-border bg-tron-panel p-5">
            <h3 className="font-display text-xl text-tron-text-bright">EXTEND ACTION WINDOW</h3>
            <p className="mt-3 text-sm text-tron-text">Specify extension duration in minutes.</p>
            <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-tron-cyan">Minutes</label>
            <input
              type="number"
              min={1}
              value={extendDraft.minutes}
              onChange={(e) => setExtendDraft((prev) => ({ ...prev, minutes: Number(e.target.value || 0) }))}
              className="hud-input mt-2 w-full"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={!extendDraft.minutes || extendDraft.minutes < 1}
                onClick={() => {
                  const selected = actions.find((a) => a.id === extendDraft.actionId)
                  if (!selected) return
                  extendAction(selected.id, extendDraft.minutes)
                  setExtendDraft({ actionId: null, minutes: 1440 })
                }}
                className="border border-tron-cyan px-4 py-2 text-xs uppercase tracking-[0.16em] text-tron-cyan shadow-glow-cyan disabled:opacity-40"
              >
                CONFIRM EXTEND
              </button>
              <button
                type="button"
                onClick={() => setExtendDraft({ actionId: null, minutes: 1440 })}
                className="border border-tron-border px-4 py-2 text-xs uppercase tracking-[0.16em] text-tron-text"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-5 right-5 z-50 border border-emerald-400 bg-emerald-500/15 px-4 py-3 text-sm uppercase tracking-[0.16em] text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.45)]">
          {toast}
        </div>
      ) : null}
    </div>
  )
}
