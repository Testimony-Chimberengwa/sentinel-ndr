import { useContext } from 'react'
import { ResponseActionsContext } from '../context/ResponseActionsContext'

export function useResponseActions() {
  const ctx = useContext(ResponseActionsContext)
  if (!ctx) {
    throw new Error('useResponseActions must be used within ResponseActionsProvider')
  }
  return ctx
}
