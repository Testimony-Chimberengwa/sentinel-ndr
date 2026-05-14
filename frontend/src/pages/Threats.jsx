import { useEffect, useMemo, useState } from 'react'
import HUDCard from '../components/ui/HUDCard'
import { useAlerts } from '../hooks/useAlerts'
import { useDevices } from '../hooks/useDevices'
import AlertInvestigationPanel from '../components/alerts/AlertInvestigationPanel'
import SeverityBadge from '../components/ui/SeverityBadge'

const feedTabs = [
  { key: 'UNACKNOWLEDGED', label: 'UNACKNOWLEDGED' },
  { key: 'ALL', label: 'ALL' },
  { key: 'ACKNOWLEDGED', label: 'ACKNOWLEDGED' },
]

const severityOrder = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
}

const severityTone = {
  CRITICAL: 'border-tron-red',
  HIGH: 'border-orange-400',
  MEDIUM: 'border-tron-amber',
  LOW: 'border-tron-cyan-dim',
}

function groupAlerts(alerts) {
  return alerts.reduce((acc, alert) => {
    const key = alert.attackType
    if (!acc[key]) acc[key] = []
    acc[key].push(alert)
    return acc
  }, {})
}

export default function Threats() {
  const { alerts } = useAlerts()
  const { devices } = useDevices()

  const [expandedCategory, setExpandedCategory] = useState(null)
  const [selectedAlertId, setSelectedAlertId] = useState(null)
  const [feedTab, setFeedTab] = useState('ALL')
  const [deviceFilter, setDeviceFilter] = useState(null)

  const filteredAlerts = useMemo(
    () => alerts.filter((alert) => (deviceFilter ? alert.deviceId === deviceFilter : true)),
    [alerts, deviceFilter],
  )

  const grouped = useMemo(() => groupAlerts(filteredAlerts), [filteredAlerts])
  const categories = useMemo(
    () =>
      Object.entries(grouped)
        .map(([attackType, items]) => ({
          attackType,
          items: [...items].sort((a, b) => new Date(b.raisedAt).getTime() - new Date(a.raisedAt).getTime()),
          count: items.length,
          severity: [...items].sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity])[0]?.severity || 'LOW',
        }))
        .sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]),
    [grouped],
  )

  const selectedAlert = alerts.find((alert) => alert.id === selectedAlertId) || categories[0]?.items[0] || null
  const selectedDevice = selectedAlert ? devices.find((device) => device.id === selectedAlert.deviceId) : null

  useEffect(() => {
    if (!selectedAlert) return
    const visible = filteredAlerts.some((alert) => alert.id === selectedAlert.id)
    if (!visible) {
      setSelectedAlertId(filteredAlerts[0]?.id || null)
    }
  }, [filteredAlerts, selectedAlert])

  useEffect(() => {
    if (!selectedAlertId && categories[0]?.items[0]) {
      setExpandedCategory(categories[0].attackType)
      setSelectedAlertId(categories[0].items[0].id)
    }
  }, [categories, selectedAlertId])

  const visibleCategories = useMemo(
    () =>
      categories.filter((category) => {
        const items = category.items.filter((alert) => {
          if (feedTab === 'UNACKNOWLEDGED') return !alert.acknowledged
          if (feedTab === 'ACKNOWLEDGED') return alert.acknowledged
          return true
        })
        return items.length > 0
      }),
    [categories, feedTab],
  )

  const selectedDeviceAlertCount = selectedDevice ? filteredAlerts.filter((alert) => alert.deviceId === selectedDevice.id).length : 0

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-tron-cyan">INVESTIGATION WORKSPACE</p>
          <h2 className="font-display text-2xl text-tron-text-bright">SLOW-AND-LOW ALERT FEED</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setDeviceFilter(null)} className={`border px-3 py-2 text-xs uppercase tracking-[0.16em] ${!deviceFilter ? 'border-tron-cyan text-tron-cyan' : 'border-tron-border text-tron-text'}`}>
            ALL DEVICES
          </button>
          {deviceFilter ? (
            <button type="button" onClick={() => setDeviceFilter(null)} className="border border-tron-amber px-3 py-2 text-xs uppercase tracking-[0.16em] text-tron-amber">
              CLEAR DEVICE FILTER
            </button>
          ) : null}
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[35%_65%]">
        <HUDCard title="ALERT FEED" className="min-h-[760px]">
          <div className="mb-3 flex flex-wrap gap-2">
            {feedTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFeedTab(tab.key)}
                className={`border px-3 py-2 text-[11px] uppercase tracking-[0.16em] ${feedTab === tab.key ? 'border-tron-cyan bg-tron-cyan/10 text-tron-cyan' : 'border-tron-border text-tron-text'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 overflow-auto pr-1">
            {visibleCategories.map((category) => {
              const isOpen = expandedCategory === category.attackType
              const visibleItems = category.items.filter((alert) => {
                if (feedTab === 'UNACKNOWLEDGED') return !alert.acknowledged
                if (feedTab === 'ACKNOWLEDGED') return alert.acknowledged
                return true
              })

              return (
                <div key={category.attackType} className={`border-l-2 ${severityTone[category.severity]} bg-black/25 p-3`}>
                  <button
                    type="button"
                    onClick={() => setExpandedCategory(isOpen ? null : category.attackType)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <p className="font-display text-lg text-tron-text-bright">{category.attackType.toUpperCase()}</p>
                      {category.count > 1 ? <p className="text-xs uppercase tracking-[0.16em] text-tron-text">Multiple occurrences</p> : null}
                    </div>
                    <span className="inline-flex border border-tron-border px-2 py-1 text-xs text-tron-text-bright">{category.count}</span>
                  </button>

                  {isOpen ? (
                    <div className="mt-3 space-y-2">
                      {visibleItems.map((alert) => {
                        const device = devices.find((d) => d.id === alert.deviceId)
                        return (
                          <button
                            key={alert.id}
                            type="button"
                            onClick={() => setSelectedAlertId(alert.id)}
                            className={`w-full border px-3 py-3 text-left ${selectedAlert?.id === alert.id ? 'border-tron-cyan bg-tron-cyan/10' : 'border-tron-border bg-black/20 hover:bg-black/30'}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <SeverityBadge severity={alert.severity} />
                                  <span className={`border px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${alert.acknowledged ? 'border-tron-cyan text-tron-cyan' : 'border-tron-amber text-tron-amber'}`}>
                                    {alert.acknowledged ? 'ACKNOWLEDGED' : 'UNACKNOWLEDGED'}
                                  </span>
                                </div>
                                <p className="mt-2 text-sm text-tron-text-bright">{device?.name || alert.deviceId}</p>
                                <p className="text-xs text-tron-text">{formatUtc(alert.raisedAt)}</p>
                              </div>
                              <p className="text-xs text-tron-text">{alert.id}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </HUDCard>

        <div className="space-y-4">
          {selectedAlert && selectedDevice ? (
            <AlertInvestigationPanel
              alert={selectedAlert}
              device={selectedDevice}
              compact={false}
              onFilterByDevice={(deviceId) => {
                setDeviceFilter(deviceId)
                setExpandedCategory(selectedAlert.attackType)
              }}
            />
          ) : (
            <HUDCard title="INVESTIGATION WORKSPACE">
              <p className="text-sm text-tron-text">No alert selected.</p>
            </HUDCard>
          )}

          {deviceFilter ? (
            <HUDCard title="DEVICE FILTER SUMMARY">
              <p className="text-sm text-tron-text-bright">Showing {selectedDeviceAlertCount} alerts for {selectedDevice?.name || 'selected device'}.</p>
            </HUDCard>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function formatUtc(ts) {
  return new Date(ts).toUTCString()
}
