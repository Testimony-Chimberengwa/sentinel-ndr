import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import AttackNarrative from '../components/alerts/AttackNarrative'
import RemediationCentre from '../components/alerts/RemediationCentre'
import TrafficScatter from '../components/charts/TrafficScatter'
import HUDCard from '../components/ui/HUDCard'
import TerminalPanel from '../components/ui/TerminalPanel'
import ThreatGauge from '../components/ui/ThreatGauge'
import { getConnectionLog } from '../data/mockData'
import { useAlerts } from '../hooks/useAlerts'
import { useDevices } from '../hooks/useDevices'

const tone = (v) => (v >= 80 ? '#ff2020' : v >= 50 ? '#ffaa00' : '#00f5ff')

export default function AlertDetail() {
  const { alertId } = useParams()
  const { getAlertById } = useAlerts()
  const { devices } = useDevices()

  const alert = getAlertById(alertId)
  const device = alert ? devices.find((d) => d.id === alert.deviceId) : null
  const evidenceTraffic = useMemo(() => (device ? getConnectionLog(device.id) : []), [device])

  if (!alert || !device) {
    return <p className="text-tron-red">Alert not found.</p>
  }

  return (
    <div className="space-y-4">
      <HUDCard title="ALERT HEADER">
        <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
          <div className="space-y-2 text-sm text-tron-text">
            <p className="font-display text-3xl text-tron-text-bright">{alert.id}</p>
            <p>Severity: <span className="text-tron-red">{alert.severity}</span> | Status: <span className="text-tron-cyan">{alert.status}</span></p>
            <p>Device: {device.name} ({device.ip}) - {device.os}</p>
            <p>Sensor: {device.sensor}</p>
            <p>Raised: {new Date(alert.raisedAt).toUTCString()} | Duration: {alert.duration}</p>
          </div>
          <div className="flex items-center justify-center">
            <ThreatGauge value={alert.threat} size={220} label="Threat Confidence" color={tone(alert.threat)} />
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ThreatGauge value={Math.round(alert.gmm * 100)} size={120} label="GMM Score" color="#00f5ff" />
          <ThreatGauge value={Math.round(alert.kde * 100)} size={120} label="KDE Score" color="#ff2020" />
          <ThreatGauge value={Math.round(alert.lowess * 100)} size={120} label="LOWESS Score" color="#ffaa00" />
        </div>
      </HUDCard>

      <TerminalPanel
        title="SENTINEL INTELLIGENCE - THREAT ASSESSMENT"
        text={alert.summary + ' ANALYSIS COMPLETE'}
      />

      <HUDCard title="EVIDENCE TIMELINE">
        <AttackNarrative steps={alert.evidence} />
      </HUDCard>

      <HUDCard title="TRAFFIC EVIDENCE">
        <TrafficScatter data={evidenceTraffic} />
      </HUDCard>

      <RemediationCentre
        attackType={alert.attackType}
        alertId={alert.id}
        deviceId={device.id}
        deviceName={device.name}
        deviceIp={device.ip}
      />
    </div>
  )
}
