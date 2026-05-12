const now = new Date()

const minutesAgo = (m) => new Date(now.getTime() - m * 60_000).toISOString()

export const dashboardMetrics = [
  { key: 'activeThreats', label: 'Active Threats', value: 7, suffix: '' },
  { key: 'baselineDrift', label: 'Baseline Drift Score', value: 0.42, suffix: '' },
  { key: 'latency', label: 'Detection Latency (ms)', value: 184, suffix: '' },
  { key: 'fpr', label: 'False Positive Rate', value: 2.1, suffix: '%' },
]

export const anomalyTimeline = Array.from({ length: 60 }).map((_, i) => {
  const t = 59 - i
  return {
    minute: `${t}m`,
    gmm: 0.18 + Math.sin(i / 8) * 0.04 + i * 0.0006,
    kde: 0.22 + Math.cos(i / 10) * 0.05 + i * 0.0008,
    lowess: 0.2 + i * 0.0045,
  }
})

export const devices = [
  {
    id: 'vm-recon-lab',
    name: 'VM-RECON-LAB',
    ip: '192.168.137.50',
    mac: '08:00:27:AB:1E:50',
    os: 'Kali Linux',
    type: 'VM',
    sensor: 'SENSOR ACTIVE',
    threatLevel: 'SUSPICIOUS',
    lastSeen: minutesAgo(2),
    daysMonitored: 34,
    miniFusion: [26, 28, 30, 32, 34, 35, 37, 40, 44, 48, 52, 56],
    metrics: {
      totalConnections24h: 1287,
      uniqueDstIps: 164,
      avgBytesPerConnection: 4150,
      suspiciousEvents: 27,
    },
  },
  {
    id: 'laptop-dev-01',
    name: 'LAPTOP-DEV-01',
    ip: '192.168.137.12',
    mac: 'F4:5C:89:22:D1:12',
    os: 'Windows 11',
    type: 'Laptop',
    sensor: 'SENSOR ACTIVE',
    threatLevel: 'CLEAN',
    lastSeen: minutesAgo(1),
    daysMonitored: 51,
    miniFusion: [14, 16, 13, 12, 15, 14, 13, 16, 15, 12, 11, 13],
    metrics: {
      totalConnections24h: 994,
      uniqueDstIps: 71,
      avgBytesPerConnection: 9800,
      suspiciousEvents: 3,
    },
  },
  {
    id: 'server-db-primary',
    name: 'SERVER-DB-PRIMARY',
    ip: '192.168.137.5',
    mac: '00:1A:2B:44:BF:05',
    os: 'Ubuntu 22.04',
    type: 'Server',
    sensor: 'SENSOR ACTIVE',
    threatLevel: 'CLEAN',
    lastSeen: minutesAgo(1),
    daysMonitored: 82,
    miniFusion: [11, 12, 12, 11, 13, 12, 11, 10, 11, 12, 10, 11],
    metrics: {
      totalConnections24h: 2841,
      uniqueDstIps: 54,
      avgBytesPerConnection: 12440,
      suspiciousEvents: 4,
    },
  },
  {
    id: 'workstation-soc-01',
    name: 'WORKSTATION-SOC-01',
    ip: '192.168.137.8',
    mac: '6C:4B:90:BE:88:08',
    os: 'Windows 10',
    type: 'Workstation',
    sensor: 'SENSOR ACTIVE',
    threatLevel: 'CLEAN',
    lastSeen: minutesAgo(4),
    daysMonitored: 63,
    miniFusion: [17, 16, 15, 16, 17, 15, 14, 16, 15, 14, 16, 17],
    metrics: {
      totalConnections24h: 1171,
      uniqueDstIps: 62,
      avgBytesPerConnection: 7620,
      suspiciousEvents: 5,
    },
  },
  {
    id: 'vm-test-exfil',
    name: 'VM-TEST-EXFIL',
    ip: '192.168.137.99',
    mac: '08:00:27:7D:2A:99',
    os: 'Ubuntu 20.04',
    type: 'VM',
    sensor: 'SENSOR ACTIVE',
    threatLevel: 'COMPROMISED',
    lastSeen: minutesAgo(0),
    daysMonitored: 22,
    miniFusion: [31, 34, 38, 42, 47, 52, 58, 64, 71, 78, 86, 91],
    metrics: {
      totalConnections24h: 1733,
      uniqueDstIps: 207,
      avgBytesPerConnection: 2050,
      suspiciousEvents: 59,
    },
  },
  {
    id: 'phone-android-01',
    name: 'PHONE-ANDROID-01',
    ip: '192.168.137.23',
    mac: 'A8:5B:78:EE:13:23',
    os: 'Android 14',
    type: 'Mobile',
    sensor: 'SENSOR ACTIVE',
    threatLevel: 'CLEAN',
    lastSeen: minutesAgo(7),
    daysMonitored: 19,
    miniFusion: [18, 21, 19, 18, 22, 24, 23, 22, 24, 25, 23, 24],
    metrics: {
      totalConnections24h: 641,
      uniqueDstIps: 44,
      avgBytesPerConnection: 5440,
      suspiciousEvents: 7,
    },
  },
  {
    id: 'laptop-mgmt-02',
    name: 'LAPTOP-MGMT-02',
    ip: '192.168.137.31',
    mac: '2C:F0:5D:71:4A:31',
    os: 'macOS Ventura',
    type: 'Laptop',
    sensor: 'SENSOR OFFLINE',
    threatLevel: 'CLEAN',
    lastSeen: minutesAgo(130),
    daysMonitored: 47,
    miniFusion: [13, 15, 15, 14, 13, 12, 13, 14, 15, 15, 14, 13],
    metrics: {
      totalConnections24h: 442,
      uniqueDstIps: 32,
      avgBytesPerConnection: 9230,
      suspiciousEvents: 0,
    },
  },
]

export const alerts = [
  {
    id: 'SNTNL-0047',
    deviceId: 'vm-test-exfil',
    attackType: 'Low-Intensity Data Exfiltration',
    threat: 91,
    layers: ['GMM', 'KDE', 'LOWESS', 'FUSION'],
    duration: '22 days',
    severity: 'CRITICAL',
    status: 'OPEN',
    raisedAt: '2026-05-10T14:29:00Z',
    gmm: 0.62,
    kde: 0.84,
    lowess: 0.93,
    summary:
      'SENTINEL monitored VM-TEST-EXFIL (192.168.137.99) for 22 days and observed recurring micro-transfers to 41.215.88.34 between 02:00 and 04:30 UTC. Individual sessions remained between 2KB and 18KB, but cumulative outbound movement reached 340MB across 847 transfers. LOWESS identified sustained upward drift, KDE confirmed density departure for comparable VM traffic, and GMM signaled persistent baseline displacement. Pattern confidence aligns with staged data exfiltration designed to evade volume thresholds. HDT fusion confidence is 91 percent.',
    evidence: [
      'Day 1: Baseline established. SMB and DNS traffic stable. GMM 0.11 | KDE 0.13 | LOWESS 0.09',
      'Day 3: KDE flagged sparse shift in outbound destinations. GMM 0.17 | KDE 0.31 | LOWESS 0.16',
      'Day 6: LOWESS slope exceeded +0.04/day. GMM 0.21 | KDE 0.39 | LOWESS 0.44',
      'Day 11: Transfer cadence tightened to every 4 hours. GMM 0.28 | KDE 0.52 | LOWESS 0.63',
      'Day 18: Fusion confidence crossed 0.80 with cross-layer agreement.',
      'Day 22: Alert raised for low-intensity exfiltration at 91 percent confidence.',
    ],
  },
  {
    id: 'SNTNL-0046',
    deviceId: 'vm-recon-lab',
    attackType: 'Slow Port Reconnaissance',
    threat: 74,
    layers: ['GMM', 'LOWESS', 'FUSION'],
    duration: '14 days',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    raisedAt: '2026-05-09T09:12:00Z',
    gmm: 0.49,
    kde: 0.31,
    lowess: 0.77,
    summary:
      'Over a 14-day monitoring window, VM-RECON-LAB progressively expanded destination port probing against internal and internet hosts with low packet volume to avoid threshold alarms. Probe frequency increased from 22 to 180 unique ports/day while bytes per session remained minimal. LOWESS captured persistent gradient acceleration, and GMM registered mild but durable drift from baseline behavior. Fusion analysis indicates coordinated slow reconnaissance with 74 percent confidence.',
    evidence: [
      'Day 1: Baseline established. Normal DNS and package updates only.',
      'Day 4: GMM deviation reached 0.18, still below static trigger.',
      'Day 7: LOWESS gradient rose to +0.03/day with repetitive low-byte scans.',
      'Day 10: Internal subnet sweep widened to 192.168.137.0/24 endpoints.',
      'Day 14: Fusion threshold exceeded with temporal drift consensus.',
    ],
  },
  {
    id: 'SNTNL-0044',
    deviceId: 'laptop-dev-01',
    attackType: 'Throttled C2 Beaconing',
    threat: 43,
    layers: ['KDE', 'LOWESS'],
    duration: '8 days',
    severity: 'MEDIUM',
    status: 'OPEN',
    raisedAt: '2026-05-06T17:01:00Z',
    gmm: 0.22,
    kde: 0.44,
    lowess: 0.51,
    summary:
      'LAPTOP-DEV-01 exhibited periodic HTTPS egress bursts to rotating domains every 97 to 122 minutes, each under 4KB. While baseline profile remained mostly stable, KDE detected anomalous density relative to workstation peers and LOWESS reported gentle but persistent upward trend in beacon regularity. Evidence matches low-and-slow command-and-control beaconing behavior. Composite confidence remains moderate at 43 percent pending containment validation.',
    evidence: [
      'Day 2: Slight endpoint entropy increase observed.',
      'Day 4: KDE crossed local density threshold for developer laptops.',
      'Day 6: LOWESS highlighted rising temporal periodicity.',
      'Day 8: Medium-severity beaconing alert generated.',
    ],
  },
  {
    id: 'SNTNL-0041',
    deviceId: 'phone-android-01',
    attackType: 'Anomalous DNS Query Pattern',
    threat: 31,
    layers: ['KDE', 'FUSION'],
    duration: '3 days',
    severity: 'LOW',
    status: 'OPEN',
    raisedAt: '2026-05-04T05:42:00Z',
    gmm: 0.12,
    kde: 0.37,
    lowess: 0.23,
    summary:
      'PHONE-ANDROID-01 generated elevated DNS request diversity during pre-dawn windows with short-lived domains and low response TTLs. Query volume stayed modest, but domain-class distribution diverged from mobile baseline population. KDE flagged global density mismatch while fusion logic preserved low severity due to weak temporal acceleration. Event is consistent with early-stage resolver abuse and is tracked at 31 percent confidence.',
    evidence: [
      'Day 1: DNS diversity index rose by 18 percent.',
      'Day 2: KDE detected out-of-family domain entropy.',
      'Day 3: Low-confidence fusion event opened for analyst review.',
    ],
  },
  {
    id: 'SNTNL-0038',
    deviceId: 'server-db-primary',
    attackType: 'Incremental Privilege Escalation',
    threat: 67,
    layers: ['GMM', 'KDE', 'LOWESS', 'FUSION'],
    duration: '11 days',
    severity: 'HIGH',
    status: 'RESOLVED',
    raisedAt: '2026-04-29T21:18:00Z',
    gmm: 0.54,
    kde: 0.66,
    lowess: 0.68,
    summary:
      'SERVER-DB-PRIMARY showed stepwise administrative command drift and unusual account context transitions over 11 days. Privileged session duration increased gradually while command density remained low per event. Multi-layer agreement across GMM, KDE, and LOWESS indicated adversarial drift rather than routine maintenance. Fusion confidence peaked at 67 percent and the incident was resolved after account key rotation and policy hardening.',
    evidence: [
      'Day 3: Elevated sudo context usage from non-maintenance windows.',
      'Day 6: KDE detected unusual command-class density.',
      'Day 9: LOWESS flagged sustained privilege trend growth.',
      'Day 11: Alert resolved after remediation controls.',
    ],
  },
]

export const threats = Array.from({ length: 18 }).map((_, i) => ({
  id: `THR-${100 + i}`,
  timestamp: minutesAgo(i * 37),
  srcIp: i % 2 ? '192.168.137.50' : '192.168.137.99',
  dstIp: i % 3 ? '41.215.88.34' : '102.133.17.120',
  protocol: i % 2 ? 'TCP' : 'UDP',
  duration: `${15 + i}s`,
  gmm: +(0.18 + i * 0.014).toFixed(2),
  kde: +(0.2 + i * 0.017).toFixed(2),
  lowess: +(0.24 + i * 0.02).toFixed(2),
  fusion: +(0.22 + i * 0.021).toFixed(2),
  status: i % 4 === 0 ? 'OPEN' : 'TRIAGED',
}))

export const driftHistory = Array.from({ length: 7 }).map((_, i) => ({
  day: `D-${6 - i}`,
  drift: +(0.17 + i * 0.06 + (i % 2 ? 0.02 : -0.01)).toFixed(2),
  type: i > 3 ? 'ADVERSARIAL DRIFT' : 'LEGITIMATE EVOLUTION',
}))

export const alertFeed = [
  {
    severity: 'CRITICAL',
    timestamp: '2026-05-10 14:29 UTC',
    path: '192.168.137.99 -> 41.215.88.34',
    attack: 'Low-Intensity Data Exfiltration',
    confidence: 91,
  },
  {
    severity: 'HIGH',
    timestamp: '2026-05-09 09:12 UTC',
    path: '192.168.137.50 -> 192.168.137.0/24',
    attack: 'Slow Port Reconnaissance',
    confidence: 74,
  },
  {
    severity: 'MEDIUM',
    timestamp: '2026-05-06 17:01 UTC',
    path: '192.168.137.12 -> c2-edge domains',
    attack: 'Throttled C2 Beaconing',
    confidence: 43,
  },
]

export const getDeviceById = (id) => devices.find((d) => d.id === id)

export const getAlertById = (id) => alerts.find((a) => a.id === id)

export const getDeviceTimeline = (deviceId, range = '7d') => {
  const points = range === '24h' ? 24 : range === '30d' ? 30 : 14
  const suspicious = deviceId === 'vm-recon-lab' || deviceId === 'vm-test-exfil'

  return Array.from({ length: points }).map((_, i) => {
    const x = range === '24h' ? `${i}:00` : `D${i + 1}`
    const base = suspicious ? 0.16 + i * 0.012 : 0.11 + Math.sin(i / 4) * 0.02
    const kde = suspicious ? 0.18 + i * 0.009 : 0.13 + Math.cos(i / 3) * 0.015
    const lowess = suspicious ? 0.2 + i * 0.021 : 0.12 + i * 0.002
    const fusion = suspicious ? 0.24 + i * 0.025 : 0.14 + Math.sin(i / 5) * 0.02

    return {
      x,
      gmm: +Math.min(base, 0.72).toFixed(2),
      kde: +Math.min(kde, 0.7).toFixed(2),
      lowess: +Math.min(lowess, 0.95).toFixed(2),
      fusion: +Math.min(fusion, 0.97).toFixed(2),
    }
  })
}

export const getConnectionLog = (deviceId) => {
  const suspicious = deviceId === 'vm-recon-lab' || deviceId === 'vm-test-exfil'

  return Array.from({ length: 14 }).map((_, i) => ({
    id: `${deviceId}-${i}`,
    timestamp: `2026-05-${String(12 - (i % 6)).padStart(2, '0')} ${String((i * 4) % 24).padStart(2, '0')}:12`,
    dstIp: suspicious && i % 3 === 0 ? '41.215.88.34' : `192.168.137.${20 + i}`,
    port: suspicious ? [53, 80, 443, 8080, 445][i % 5] : [53, 443, 445][i % 3],
    protocol: i % 2 === 0 ? 'TCP' : 'UDP',
    bytes: suspicious && i % 3 === 0 ? 4096 + i * 128 : 16000 + i * 1200,
    duration: `${8 + i}s`,
    anomaly: +(suspicious ? 0.33 + i * 0.03 : 0.08 + i * 0.01).toFixed(2),
    flag: suspicious && i % 3 === 0 ? 'FLAGGED' : 'NORMAL',
  }))
}

export const getRemediationActions = (attackType) => {
  if (attackType.includes('Exfiltration')) {
    return [
      {
        priority: 1,
        name: 'QUARANTINE DEVICE',
        description:
          'Immediately isolate the affected VM from all segments and block inbound and outbound traffic to stop ongoing leakage.',
        effort: 'AUTOMATED',
        impact: 'HIGH DISRUPTION',
        button: 'QUARANTINE NOW',
        tone: 'red',
      },
      {
        priority: 2,
        name: 'BLOCK DESTINATION IP',
        description:
          'Add destination 41.215.88.34 to gateway blocklists while preserving internal forensic access to the host.',
        effort: 'AUTOMATED',
        impact: 'LOW DISRUPTION',
        button: 'BLOCK IP',
        tone: 'amber',
      },
      {
        priority: 3,
        name: 'ENFORCE PATTERN OF LIFE',
        description:
          'Permit only baseline-conforming communication for this device and escalate any drift automatically.',
        effort: 'AUTOMATED',
        impact: 'MEDIUM DISRUPTION',
        button: 'ENFORCE',
        tone: 'cyan',
      },
      {
        priority: 4,
        name: 'CAPTURE FULL PACKET DUMP',
        description:
          'Enable deep packet capture for 24 hours to preserve payload-level evidence for investigation.',
        effort: 'MANUAL',
        impact: 'LOW DISRUPTION',
        button: 'ENABLE CAPTURE',
        tone: 'cyan',
      },
      {
        priority: 5,
        name: 'RESET BEHAVIOURAL BASELINE',
        description:
          'Request baseline reset only after containment and clean-state verification are complete.',
        effort: 'REQUIRES APPROVAL',
        impact: 'LOW DISRUPTION',
        button: 'REQUEST RESET',
        tone: 'amber',
      },
    ]
  }

  if (attackType.includes('Reconnaissance')) {
    return [
      {
        priority: 1,
        name: 'ENFORCE PATTERN OF LIFE',
        description: 'Block outbound connections that do not match known baseline behavior.',
        effort: 'AUTOMATED',
        impact: 'MEDIUM DISRUPTION',
        button: 'ENFORCE',
        tone: 'cyan',
      },
      {
        priority: 2,
        name: 'RATE LIMIT OUTBOUND CONNECTIONS',
        description: 'Throttle outbound rate to 10 sessions per minute to reduce scan surface.',
        effort: 'AUTOMATED',
        impact: 'LOW DISRUPTION',
        button: 'RATE LIMIT',
        tone: 'amber',
      },
      {
        priority: 3,
        name: 'ALERT SOC ANALYST',
        description: 'Escalate to analyst with attached timeline and packet metadata package.',
        effort: 'AUTOMATED',
        impact: 'LOW DISRUPTION',
        button: 'ESCALATE',
        tone: 'cyan',
      },
      {
        priority: 4,
        name: 'ENABLE HONEYPOT RESPONSE',
        description: 'Deploy decoy services on scanned ports to collect attacker behavior.',
        effort: 'MANUAL',
        impact: 'LOW DISRUPTION',
        button: 'ENABLE HONEYPOT',
        tone: 'amber',
      },
      {
        priority: 5,
        name: 'ISOLATE NETWORK SEGMENT',
        description: 'Move host to quarantine VLAN pending full triage review.',
        effort: 'REQUIRES APPROVAL',
        impact: 'HIGH DISRUPTION',
        button: 'REQUEST ISOLATION',
        tone: 'red',
      },
    ]
  }

  return [
    {
      priority: 1,
      name: 'BLOCK DESTINATION IP',
      description: 'Terminate suspected C2 channel by adding remote endpoint to block policy.',
      effort: 'AUTOMATED',
      impact: 'LOW DISRUPTION',
      button: 'BLOCK IP',
      tone: 'amber',
    },
    {
      priority: 2,
      name: 'DNS SINKHOLE',
      description: 'Redirect suspicious domains to controlled sinkhole infrastructure.',
      effort: 'AUTOMATED',
      impact: 'MEDIUM DISRUPTION',
      button: 'SINKHOLE DNS',
      tone: 'cyan',
    },
    {
      priority: 3,
      name: 'QUARANTINE DEVICE',
      description: 'Isolate host from lateral movement while preserving forensic collection.',
      effort: 'AUTOMATED',
      impact: 'HIGH DISRUPTION',
      button: 'QUARANTINE NOW',
      tone: 'red',
    },
    {
      priority: 4,
      name: 'FORENSIC MEMORY DUMP',
      description: 'Capture volatile memory for malware process and credential artifact analysis.',
      effort: 'MANUAL',
      impact: 'LOW DISRUPTION',
      button: 'CAPTURE MEMORY',
      tone: 'cyan',
    },
  ]
}

export const initialRemediationLog = [
  '[2026-05-10 14:32] SENTINEL > Destination IP 41.215.88.34 added to blocklist',
  '[2026-05-10 14:33] SENTINEL > Firewall rules updated across 3 gateway interfaces',
  '[2026-05-10 14:33] SENTINEL > SOC notification sent to analyst@sentinel.local',
]
