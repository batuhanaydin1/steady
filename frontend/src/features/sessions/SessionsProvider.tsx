import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiError } from '../../api/client.ts'
import { createFocusSession, listFocusSessions } from '../../api/focusSessions.ts'
import type { CreateFocusSessionRequest, FocusSessionResponse } from '../../types/api.ts'
import { SessionsContext } from './sessionsContext.ts'
import type { SessionsContextValue } from './sessionsContext.ts'
import { HISTORY_LIMIT } from './sessions.ts'

function messageFor(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback
}

/**
 * Owns the focus-session history for the whole app.
 *
 * The timer lives above the screens and calls `record` when a focus session
 * finishes, so the history updates wherever the user happens to be. A session
 * that fails to save is never dropped silently: it stays in `unsaved` until the
 * user retries it.
 */
export function SessionsProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<FocusSessionResponse[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [unsaved, setUnsaved] = useState<CreateFocusSessionRequest | null>(null)
  const [attempt, setAttempt] = useState(0)

  // Read by `save`, which needs to know whether the history ever loaded.
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    listFocusSessions(HISTORY_LIMIT, controller.signal)
      .then((data) => {
        if (!active) return
        setSessions(data)
        setState('ready')
        setLoadError(null)
      })
      .catch((error: unknown) => {
        if (!active) return
        if (error instanceof DOMException && error.name === 'AbortError') return
        setState('error')
        setLoadError(messageFor(error, 'Could not load your session history.'))
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [attempt])

  const reload = useCallback(() => {
    setState('loading')
    setLoadError(null)
    setAttempt((value) => value + 1)
  }, [])

  const save = useCallback(async (input: CreateFocusSessionRequest) => {
    setUnsaved(null)
    try {
      const created = await createFocusSession(input)
      setSessions((current) => [created, ...current])

      // If the API was down when the history loaded, the list is still empty and
      // in its error state. Now that a write got through, fetch it properly.
      if (stateRef.current === 'error') {
        setState('loading')
        setLoadError(null)
        setAttempt((value) => value + 1)
      }
    } catch {
      // Keep the payload so the user can retry from the Focus screen.
      setUnsaved(input)
    }
  }, [])

  const record = useCallback(
    (input: CreateFocusSessionRequest) => {
      void save(input)
    },
    [save],
  )

  const retryRecord = useCallback(() => {
    if (unsaved) void save(unsaved)
  }, [save, unsaved])

  const dismissUnsaved = useCallback(() => setUnsaved(null), [])

  const value = useMemo<SessionsContextValue>(
    () => ({
      sessions,
      state,
      loadError,
      reload,
      record,
      unsaved,
      retryRecord,
      dismissUnsaved,
    }),
    [sessions, state, loadError, reload, record, unsaved, retryRecord, dismissUnsaved],
  )

  return <SessionsContext.Provider value={value}>{children}</SessionsContext.Provider>
}
