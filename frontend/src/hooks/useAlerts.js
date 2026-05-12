import { useMemo } from 'react'
import { alerts, getAlertById } from '../data/mockData'

export function useAlerts() {
  return useMemo(() => ({ alerts, getAlertById }), [])
}
