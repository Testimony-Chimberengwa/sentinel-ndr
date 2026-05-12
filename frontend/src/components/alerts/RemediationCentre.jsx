import { useMemo, useState } from 'react'
import { getRemediationActions, initialRemediationLog } from '../../data/mockData'

const toneClass = {
  red: 'border-tron-red text-tron-red hover:bg-tron-red/10',
  amber: 'border-tron-amber text-tron-amber hover:bg-tron-amber/10',
  cyan: 'border-tron-cyan text-tron-cyan hover:bg-tron-cyan/10',
}

export default function RemediationCentre({ attackType }) {
  const actions = useMemo(() => getRemediationActions(attackType), [attackType])
  const [log, setLog] = useState(initialRemediationLog)

  const appendLog = (actionName) => {
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 16)
    setLog((prev) => [`[${ts}] SENTINEL > Action executed: ${actionName}`, ...prev])
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
              onClick={() => appendLog(action.name)}
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
