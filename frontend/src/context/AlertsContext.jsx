import { createContext, useCallback, useMemo, useState } from 'react'
import { alerts as seedAlerts } from '../data/mockData'

const normalizeStatus = (status) => {
  if (status === 'RESOLVED' || status === 'FALSE POSITIVE') return 'CLOSED'
  return status || 'OPEN'
}

const seed = seedAlerts.map((alert) => {
  const workflowStatus = normalizeStatus(alert.status)
  const acknowledged = workflowStatus !== 'OPEN'

  return {
    ...alert,
    status: workflowStatus,
    investigationStatus: workflowStatus,
    acknowledged,
    acknowledgedAt: acknowledged ? alert.raisedAt : null,
    acknowledgedBy: acknowledged ? 'system' : null,
    investigationOutcome: alert.status === 'FALSE POSITIVE' ? 'FALSE POSITIVE' : null,
    investigationNotes: '',
    concludedBy: workflowStatus === 'CLOSED' ? 'system' : null,
    concludedAt: workflowStatus === 'CLOSED' ? alert.raisedAt : null,
    closedAt: workflowStatus === 'CLOSED' ? alert.raisedAt : null,
    modelDefeat: alert.status === 'FALSE POSITIVE',
    autonomousResponseActive: true,
  }
})

export const AlertsContext = createContext(null)

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState(seed)

  const updateAlert = useCallback((alertId, patch) => {
    setAlerts((current) => current.map((alert) => (alert.id === alertId ? { ...alert, ...patch } : alert)))
  }, [])

  const markInvestigating = useCallback((alertId, analyst = 'analyst@sentinel.local') => {
    const ts = new Date().toISOString()
    updateAlert(alertId, {
      status: 'INVESTIGATING',
      investigationStatus: 'INVESTIGATING',
      acknowledged: true,
      acknowledgedAt: ts,
      acknowledgedBy: analyst,
    })
  }, [updateAlert])

  const acknowledgeAlert = useCallback((alertId, analyst = 'analyst@sentinel.local') => {
    const ts = new Date().toISOString()
    updateAlert(alertId, {
      acknowledged: true,
      acknowledgedAt: ts,
      acknowledgedBy: analyst,
    })
  }, [updateAlert])

  const saveAlertNotes = useCallback((alertId, notes) => {
    updateAlert(alertId, { investigationNotes: notes })
  }, [updateAlert])

  const concludeAlert = useCallback(({ alertId, outcome, analyst = 'analyst@sentinel.local', notes = '' }) => {
    const ts = new Date().toISOString()
    const closed = outcome !== 'CONFIRMED THREAT'
    updateAlert(alertId, {
      status: closed ? 'CLOSED' : 'CONCLUDED',
      investigationStatus: closed ? 'CLOSED' : 'CONCLUDED',
      investigationOutcome: outcome,
      investigationNotes: notes,
      concludedBy: analyst,
      concludedAt: ts,
      closedAt: closed ? ts : null,
      acknowledged: true,
      acknowledgedAt: ts,
      acknowledgedBy: analyst,
      modelDefeat: outcome === 'FALSE POSITIVE',
    })
  }, [updateAlert])

  const closeAlert = useCallback((alertId, analyst = 'analyst@sentinel.local') => {
    const ts = new Date().toISOString()
    updateAlert(alertId, {
      status: 'CLOSED',
      investigationStatus: 'CLOSED',
      closedAt: ts,
      acknowledged: true,
      acknowledgedAt: ts,
      acknowledgedBy: analyst,
    })
  }, [updateAlert])

  const toggleModelDefeat = useCallback((alertId) => {
    setAlerts((current) => current.map((alert) => (alert.id === alertId ? { ...alert, modelDefeat: !alert.modelDefeat } : alert)))
  }, [])

  const getAlertById = useCallback((alertId) => alerts.find((alert) => alert.id === alertId), [alerts])

  const value = useMemo(
    () => ({
      alerts,
      getAlertById,
      updateAlert,
      markInvestigating,
      acknowledgeAlert,
      saveAlertNotes,
      concludeAlert,
      closeAlert,
      toggleModelDefeat,
    }),
    [
      alerts,
      getAlertById,
      updateAlert,
      markInvestigating,
      acknowledgeAlert,
      saveAlertNotes,
      concludeAlert,
      closeAlert,
      toggleModelDefeat,
    ],
  )

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>
}