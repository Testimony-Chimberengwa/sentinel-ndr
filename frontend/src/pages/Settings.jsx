import HUDCard from '../components/ui/HUDCard'

export default function Settings() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-tron-text-bright">SYSTEM SETTINGS</h2>
      <HUDCard title="DETECTION THRESHOLDS">
        <div className="grid gap-3 text-sm text-tron-text">
          <label>GMM Threshold<input type="range" min="0" max="100" defaultValue="25" className="w-full" /></label>
          <label>KDE Threshold<input type="range" min="0" max="100" defaultValue="35" className="w-full" /></label>
          <label>LOWESS Threshold<input type="range" min="0" max="100" defaultValue="40" className="w-full" /></label>
          <label>Fusion Threshold<input type="range" min="0" max="100" defaultValue="65" className="w-full" /></label>
        </div>
      </HUDCard>

      <HUDCard title="NETWORK INTERFACE">
        <select className="hud-input w-full md:w-96">
          <option>Wi-Fi 2 (Microsoft Wi-Fi Direct Virtual Adapter)</option>
          <option>Local Area Connection* 10</option>
        </select>
      </HUDCard>

      <HUDCard title="ALERT NOTIFICATIONS">
        <div className="space-y-2 text-sm text-tron-text">
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> WebSocket push alerts</label>
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> SOC email notification</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> SMS escalation for CRITICAL only</label>
        </div>
      </HUDCard>
    </div>
  )
}
