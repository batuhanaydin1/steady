import { createContext, useContext } from 'react'
import type { TimerMode, TimerPreferences, TimerStatus } from './timer.ts'
import type { PreferencesStatus } from './useTimerPreferences.ts'

export interface TimerContextValue {
  mode: TimerMode
  status: TimerStatus
  durationMs: number
  remainingMs: number
  /** Elapsed fraction of the current session, 0 → 1. */
  progress: number
  prefs: TimerPreferences
  /** Whether the preferences in use are the ones the API holds. */
  preferencesStatus: PreferencesStatus
  /** Why the saved preferences are not in use, when the status is `offline`. */
  preferencesError: string | null
  /** Retries the failed preferences load or save. */
  retryPreferences: () => void
  /** The mode that most recently ran to completion, until the next start. */
  completedMode: TimerMode | null
  /** Starts a new session, or resumes a paused one. */
  start: () => void
  pause: () => void
  reset: () => void
  switchMode: (mode: TimerMode) => void
  setWorkMinutes: (minutes: number) => void
  setBreakMinutes: (minutes: number) => void
  setSoundEnabled: (enabled: boolean) => void
  setNotificationsEnabled: (enabled: boolean) => void
}

export const TimerContext = createContext<TimerContextValue | null>(null)

export function useTimer(): TimerContextValue {
  const context = useContext(TimerContext)
  if (!context) {
    throw new Error('useTimer must be used inside <TimerProvider>.')
  }
  return context
}
