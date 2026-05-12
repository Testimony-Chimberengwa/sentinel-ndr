import { useEffect, useState } from 'react'

export function useWebSocket() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 650)
    return () => clearTimeout(t)
  }, [])

  return { connected }
}
