import { useMemo } from 'react'
import { devices, getDeviceById } from '../data/mockData'

export function useDevices() {
  return useMemo(() => ({ devices, getDeviceById }), [])
}
