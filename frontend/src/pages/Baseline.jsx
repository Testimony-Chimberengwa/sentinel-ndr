import DriftTracker from '../components/charts/DriftTracker'
import HUDCard from '../components/ui/HUDCard'
import { driftHistory } from '../data/mockData'

export default function Baseline() {
  const latest = driftHistory[driftHistory.length - 1]

  return (
    <div className="space-y-4">
      <HUDCard title="CONCEPT DRIFT TRACKER">
        <DriftTracker data={driftHistory} />
      </HUDCard>

      <div className="grid gap-4 md:grid-cols-2">
        <HUDCard title="DRIFT CLASSIFICATION PANEL">
          <p className="font-display text-xl text-tron-text-bright">{latest.type}</p>
          <p className="mt-2 text-sm text-tron-text">Current drift score: {latest.drift}</p>
        </HUDCard>

        <HUDCard title="LAYER STATUS">
          <div className="space-y-3 text-sm">
            <label className="flex items-center justify-between border border-tron-border p-3 text-tron-text">
              GMM Layer Status
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-cyan-400" />
            </label>
            <label className="flex items-center justify-between border border-tron-border p-3 text-tron-text">
              KDE Layer Status
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-cyan-400" />
            </label>
            <p className="border border-tron-border p-3 text-tron-cyan">Cold Start: COMPLETE (72h baseline loaded)</p>
          </div>
        </HUDCard>
      </div>
    </div>
  )
}
