import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRemediationActions, initialRemediationLog } from '../../data/mockData'
import { useResponseActions } from '../../hooks/useResponseActions'

const toneClass = {
  red: 'border-tron-red text-tron-red hover:bg-tron-red/10',
  amber: 'border-tron-amber text-tron-amber hover:bg-tron-amber/10',
  cyan: 'border-tron-cyan text-tron-cyan hover:bg-tron-cyan/10',
}

export default function RemediationCentre({ attackType, alertId, deviceId, deviceName, deviceIp }) {
  const actions = useMemo(() => getRemediationActions(attackType), [attackType])
  const navigate = useNavigate()
  const { remediationLogs, appendRemediationLog, queuePendingAction } = useResponseActions()
  const log = remediationLogs[alertId] || initialRemediationLog

  const appendLog = (actionName) => {
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 16)
    appendRemediationLog(alertId, `[${ts}] SENTINEL > Action executed: ${actionName}`)
  }

  const queueLifecycleAction = (buttonLabel) => {
    const now = Date.now()

    if (buttonLabel === 'QUARANTINE NOW') {
      queuePendingAction({
        category: 'DEVICE',
        actionType: 'DEVICE QUARANTINE',
        targetDeviceId: deviceId,
        targetDeviceName: deviceName,
        targetIp: deviceIp,
        scope: 'ALL TRAFFIC',
        triggeredByAlert: alertId,
        initiatedBy: 'ANALYST',
        expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
      })
      navigate(`/response-actions?status=pending&device=${encodeURIComponent(deviceName)}`)
    }

    if (buttonLabel === 'BLOCK IP') {
      queuePendingAction({
        category: 'NETWORK',
        actionType: 'IP BLOCK',
        targetDescriptor: '41.215.88.34',
        targetDeviceId: deviceId,
        targetDeviceName: deviceName,
        targetIp: deviceIp,
        scope: 'SPECIFIC IP',
        triggeredByAlert: alertId,
        initiatedBy: 'ANALYST',
      })
      navigate(`/response-actions?status=pending&device=${encodeURIComponent(deviceName)}`)
    }
  }

  return (
    <section className="space-y-4">
      <header>
        <h3 className="font-display text-xl text-tron-text-bright">RECOMMENDED ACTIONS - SENTINEL RESPONSE ENGINE</h3>
      </header>
      <div className="grid gap-3 xl:grid-cols-2">
        {actions.map((action) => (
          <article key={action.name} className="hud-card border border-tron-border bg-tron-panel/70 p-4">
            <p className="font-display text-sm text-tron-cyan">
              {action.priority}. {action.name}
            </p>
            <p className="mt-2 text-sm text-tron-text">{action.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.15em] text-tron-text-bright">
              <span className="border border-tron-border px-2 py-1">{action.effort}</span>
              <span className="border border-tron-border px-2 py-1">{action.impact}</span>
            </div>
            <button
              type="button"
              className={`mt-4 border px-4 py-2 text-xs uppercase tracking-[0.2em] ${toneClass[action.tone]}`}
              onClick={() => {
                appendLog(action.name)
                queueLifecycleAction(action.button)
              }}
            >
              {action.button}
            </button>
          </article>
        ))}
      </div>
      <section className="hud-card border border-tron-border bg-black/40 p-4">
        <h4 className="mb-3 font-display text-lg text-tron-text-bright">REMEDIATION LOG</h4>
        <div className="scan-lines max-h-56 space-y-2 overflow-auto border border-tron-border bg-tron-black/60 p-3 text-xs text-tron-cyan">
          {log.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>
    </section>
  )
}
