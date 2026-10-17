import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/client.ts'
import { getHealth } from '../api/health.ts'
import type { HealthResponse } from '../types/api.ts'

export type HealthState =
  | { status: 'checking' }
  | { status: 'online'; data: HealthResponse }
  | { status: 'offline'; message: string }

/**
 * Polls the API once on mount and exposes a manual `retry`.
 * Used by the shell to surface loading / error states from day one.
 */
export function useApiHealth() {
  const [state, setState] = useState<HealthState>({ status: 'checking' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    getHealth(controller.signal)
      .then((data) => {
        if (active) setState({ status: 'online', data })
      })
      .catch((error: unknown) => {
        if (!active) return
        if (error instanceof DOMException && error.name === 'AbortError') return

        const message =
          error instanceof ApiError
            ? error.message
            : 'API ile iletişim kurulurken bir sorun oluştu.'

        setState({ status: 'offline', message })
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'checking' })
    setAttempt((value) => value + 1)
  }, [])

  return { state, retry }
}
