import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { initialRemediationLog } from '../data/mockData'

const HOUR_MS = 60 * 60 * 1000

const now = Date.now()

const defaultActions = [
  {
    id: 'RA-1001',
    category: 'DEVICE',
    actionType: 'DEVICE QUARANTINE',
    targetDeviceId: 'vm-test-exfil',
    targetDeviceName: 'VM-TEST-EXFIL',
    targetIp: '192.168.137.99',
    scope: 'ALL TRAFFIC',
    status: 'ACTIVE',
    initiatedBy: 'SENTINEL-AUTO',
    triggeredByAlert: 'SNTNL-0047',
    initiatedAt: new Date(now - 52 * HOUR_MS).toISOString(),
    enforcedAt: new Date(now - 52 * HOUR_MS).toISOString(),
    expiresAt: new Date(now + 21 * HOUR_MS).toISOString(),
  },
  {
    id: 'RA-1002',
    category: 'NETWORK',
    actionType: 'IP BLOCK',
    targetDescriptor: '41.215.88.34',
    targetDeviceId: 'vm-test-exfil',
    targetDeviceName: 'VM-TEST-EXFIL',
    targetIp: '192.168.137.99',
    scope: 'SPECIFIC IP',
    status: 'ACTIVE',
    initiatedBy: 'SENTINEL-AUTO',
    triggeredByAlert: 'SNTNL-0047',
    initiatedAt: new Date(now - 52 * HOUR_MS).toISOString(),
    enforcedAt: new Date(now - 52 * HOUR_MS).toISOString(),
    expiresAt: null,
  },
  {
    id: 'RA-1003',
    category: 'DEVICE',
    actionType: 'PATTERN OF LIFE ENFORCE',
    targetDeviceId: 'vm-recon-lab',
    targetDeviceName: 'VM-RECON-LAB',
    targetIp: '192.168.137.50',
    scope: 'OUTBOUND ONLY',
    status: 'ACTIVE',
    initiatedBy: 'ANALYST',
    triggeredByAlert: 'SNTNL-0046',
    initiatedAt: new Date(now - 6 * HOUR_MS).toISOString(),
    enforcedAt: new Date(now - 6 * HOUR_MS).toISOString(),
    expiresAt: new Date(now + 18 * HOUR_MS).toISOString(),
  },
  {
    id: 'RA-1004',
    category: 'NETWORK',
    actionType: 'RATE LIMIT OUTBOUND',
    targetDeviceId: 'laptop-dev-01',
    targetDeviceName: 'LAPTOP-DEV-01',
    targetIp: '192.168.137.12',
    scope: 'OUTBOUND ONLY',
    status: 'ACTIVE',
    initiatedBy: 'SENTINEL-AUTO',
    triggeredByAlert: 'SNTNL-0044',
    initiatedAt: new Date(now - 24 * HOUR_MS).toISOString(),
    enforcedAt: new Date(now - 24 * HOUR_MS).toISOString(),
    expiresAt: new Date(now + 8 * HOUR_MS).toISOString(),
  },
  {
    id: 'RA-1005',
    category: 'NETWORK',
    actionType: 'IP BLOCK',
    targetDescriptor: '195.22.41.7',
    targetDeviceId: 'server-db-primary',
    targetDeviceName: 'SERVER-DB-PRIMARY',
    targetIp: '192.168.137.5',
    scope: 'SPECIFIC IP',
    status: 'REVERSED',
    initiatedBy: 'SENTINEL-AUTO',
    triggeredByAlert: 'SNTNL-0038',
    initiatedAt: new Date(now - 30 * HOUR_MS).toISOString(),
    enforcedAt: new Date(now - 30 * HOUR_MS).toISOString(),
    expiresAt: null,
    reversedAt: new Date(now - 25.8 * HOUR_MS).toISOString(),
    reversedBy: 'analyst@sentinel.local',
    reversalReason: 'False positive — confirmed legitimate CDN endpoint',
  },
]

const initialLogs = {
  'SNTNL-0047': initialRemediationLog,
}

export const ResponseActionsContext = createContext(null)

export function ResponseActionsProvider({ children }) {
  const [actions, setActions] = useState(defaultActions)
  const [remediationLogs, setRemediationLogs] = useState(initialLogs)

  useEffect(() => {
    const timer = setInterval(() => {
      const ts = Date.now()
      setActions((prev) =>
        prev.map((a) => {
          if (a.status !== 'ACTIVE' || !a.expiresAt) {
            return a
          }
          return new Date(a.expiresAt).getTime() <= ts ? { ...a, status: 'EXPIRED', expiredAt: new Date(ts).toISOString() } : a
        }),
      )
    }, 60_000)

    return () => clearInterval(timer)
  }, [])

  const appendRemediationLog = useCallback((alertId, line) => {
    if (!alertId) {
      return
    }
    setRemediationLogs((prev) => ({
      ...prev,
      [alertId]: [line, ...(prev[alertId] || initialRemediationLog)],
    }))
  }, [])

  const queuePendingAction = useCallback((payload) => {
    const ts = new Date().toISOString()
    const id = `RA-${Math.floor(1000 + Math.random() * 9000)}`
    const pending = {
      id,
      status: 'PENDING',
      initiatedAt: ts,
      enforcedAt: null,
      expiresAt: payload.expiresAt || null,
      scope: payload.scope || 'ALL TRAFFIC',
      initiatedBy: payload.initiatedBy || 'ANALYST',
      ...payload,
    }
    setActions((prev) => [pending, ...prev])
    return id
  }, [])

  const activatePendingAction = useCallback((actionId) => {
    const ts = new Date().toISOString()
    setActions((prev) =>
      prev.map((a) => (a.id === actionId && a.status === 'PENDING' ? { ...a, status: 'ACTIVE', enforcedAt: ts } : a)),
    )
  }, [])

  const reverseAction = useCallback(({ actionId, reason, reversedBy = 'analyst@sentinel.local' }) => {
    const ts = new Date().toISOString()
    setActions((prev) =>
      prev.map((a) =>
        a.id === actionId
          ? {
              ...a,
              status: 'REVERSED',
              reversedAt: ts,
              reversedBy,
              reversalReason: reason,
            }
          : a,
      ),
    )

    const source = actions.find((a) => a.id === actionId)
    if (source?.triggeredByAlert) {
      const stamp = ts.replace('T', ' ').slice(0, 16)
      appendRemediationLog(
        source.triggeredByAlert,
        `[${stamp}] SENTINEL > Reversal executed: ${source.actionType} on ${source.targetDeviceName}. Reason: ${reason}`,
      )
    }
  }, [actions, appendRemediationLog])

  const extendAction = useCallback((actionId) => {
    setActions((prev) =>
      prev.map((a) => {
        if (a.id !== actionId || a.status !== 'ACTIVE') {
          return a
        }
        const baseTs = a.expiresAt ? new Date(a.expiresAt).getTime() : Date.now()
        return {
          ...a,
          expiresAt: new Date(baseTs + 24 * HOUR_MS).toISOString(),
        }
      }),
    )
  }, [])

  const activeEnforcedCount = useMemo(() => actions.filter((a) => a.status === 'ACTIVE').length, [actions])

  const deviceActiveCounts = useMemo(() => {
    const map = {}
    actions.forEach((a) => {
      if (a.status !== 'ACTIVE' || !a.targetDeviceId) {
        return
      }
      map[a.targetDeviceId] = (map[a.targetDeviceId] || 0) + 1
    })
    return map
  }, [actions])

  const value = useMemo(
    () => ({
      actions,
      remediationLogs,
      activeEnforcedCount,
      deviceActiveCounts,
      queuePendingAction,
      activatePendingAction,
      reverseAction,
      extendAction,
      appendRemediationLog,
    }),
    [
      actions,
      remediationLogs,
      activeEnforcedCount,
      deviceActiveCounts,
      queuePendingAction,
      activatePendingAction,
      reverseAction,
      extendAction,
      appendRemediationLog,
    ],
  )

  return <ResponseActionsContext.Provider value={value}>{children}</ResponseActionsContext.Provider>
}
