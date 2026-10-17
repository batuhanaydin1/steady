import { createContext, useContext } from 'react'
import type { CreateFocusSessionRequest, FocusSessionResponse } from '../../types/api.ts'

export interface SessionsContextValue {
  sessions: FocusSessionResponse[]
  /** State of the initial history load. */
  state: 'loading' | 'ready' | 'error'
  loadError: string | null
  reload: () => void
  /**
   * Records a completed focus session. Called by the timer, so it never throws:
   * a session that cannot be saved is kept in `unsaved` and can be retried.
   */
  record: (input: CreateFocusSessionRequest) => void
  /** The most recent session that could not be saved, if any. */
  unsaved: CreateFocusSessionRequest | null
  retryRecord: () => void
  dismissUnsaved: () => void
}

export const SessionsContext = createContext<SessionsContextValue | null>(null)

export function useSessions(): SessionsContextValue {
  const context = useContext(SessionsContext)
  if (!context) {
    throw new Error('useSessions must be used inside <SessionsProvider>.')
  }
  return context
}
