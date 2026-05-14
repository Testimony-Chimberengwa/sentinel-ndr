import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import AttackNarrative from '../components/alerts/AttackNarrative'
import AlertInvestigationPanel from '../components/alerts/AlertInvestigationPanel'
import RemediationCentre from '../components/alerts/RemediationCentre'
import TrafficScatter from '../components/charts/TrafficScatter'
import HUDCard from '../components/ui/HUDCard'
import { getConnectionLog } from '../data/mockData'
import { useAlerts } from '../hooks/useAlerts'
import { useDevices } from '../hooks/useDevices'

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
      <AlertInvestigationPanel alert={alert} device={device} compact />

      <HUDCard title="MODEL NARRATIVE">
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
