import { useState } from 'react'
import { Fragment } from 'react'
import HUDCard from '../components/ui/HUDCard'
import { threats } from '../data/mockData'

export default function Threats() {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-tron-text-bright">FLAGGED THREAT EVENTS</h2>
      <HUDCard title="FILTER BAR">
        <div className="grid gap-2 md:grid-cols-3">
          <input className="hud-input" placeholder="Src IP" />
          <input className="hud-input" placeholder="Dst IP" />
          <input className="hud-input" placeholder="Protocol / Status" />
        </div>
      </HUDCard>

      <HUDCard>
        <div className="overflow-auto">
          <table className="w-full min-w-[1000px] text-left text-xs text-tron-text">
            <thead className="text-tron-cyan">
              <tr>
                <th>Timestamp</th><th>Src IP</th><th>Dst IP</th><th>Protocol</th><th>Duration</th><th>GMM</th><th>KDE</th><th>LOWESS</th><th>Fusion</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {threats.map((t) => (
                <Fragment key={t.id}>
                  <tr key={t.id} className="cursor-pointer border-t border-tron-border hover:bg-tron-cyan/5" onClick={() => setOpenId(openId === t.id ? null : t.id)}>
                    <td>{new Date(t.timestamp).toUTCString()}</td><td>{t.srcIp}</td><td>{t.dstIp}</td><td>{t.protocol}</td><td>{t.duration}</td><td>{t.gmm}</td><td>{t.kde}</td><td>{t.lowess}</td><td>{t.fusion}</td><td>{t.status}</td>
                  </tr>
                  {openId === t.id ? (
                    <tr className="border-t border-tron-border bg-tron-black/70 text-tron-text-bright">
                      <td colSpan={10} className="p-3">
                        Event {t.id}: sustained low-volume behavior detected with fusion score {Math.round(t.fusion * 100)}%.
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </HUDCard>
    </div>
  )
}
