import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useSessions } from '../sessions/sessionsContext.ts'
import { useTasks } from '../tasks/tasksContext.ts'
import { readJson, writeJson } from '../../utils/storage.ts'
import { playChime, showNotification, unlockAudio } from './alert.ts'
import { TimerContext } from './timerContext.ts'
import type { TimerContextValue } from './timerContext.ts'
import {
  formatClock,
  hydrateState,
  minutesForMode,
  minutesToMs,
  MODE_LABEL,
  otherMode,
  timerReducer,
} from './timer.ts'
import type { TimerMode, TimerPreferences, TimerState } from './timer.ts'
import { useTimerPreferences } from './useTimerPreferences.ts'

const SESSION_KEY = 'steady.timer.session'
const TICK_INTERVAL_MS = 250
const BASE_TITLE = 'Steady — İstikrarı kur, her seferinde bir oturum.'

/**
 * Owns the focus timer for the whole app, so a running session keeps ticking
 * (and can still alert) while the user is on another screen.
 *
 * The countdown is always derived from an absolute end timestamp, so it stays
 * accurate across re-renders, StrictMode and background-throttled timers. The
 * preferences themselves live in `useTimerPreferences`.
 */
export function TimerProvider({ children }: { children: ReactNode }) {
  const { activeTaskId } = useTasks()
  const { record } = useSessions()

  const {
    prefs,
    status: preferencesStatus,
    error: preferencesError,
    retry: retryPreferences,
    setWorkMinutes,
    setBreakMinutes,
    setSoundEnabled,
    setNotificationsEnabled,
  } = useTimerPreferences()

  const [state, dispatch] = useReducer(timerReducer, prefs, (initialPrefs) =>
    hydrateState(readJson<unknown>(SESSION_KEY, null), initialPrefs, Date.now()),
  )
  const [completedMode, setCompletedMode] = useState<TimerMode | null>(null)

  // Latest committed values, readable from timers and event listeners.
  const stateRef = useRef<TimerState>(state)
  const prefsRef = useRef<TimerPreferences>(prefs)
  const activeTaskIdRef = useRef<string | null>(activeTaskId)
  const recordRef = useRef(record)
  useEffect(() => {
    stateRef.current = state
    prefsRef.current = prefs
    activeTaskIdRef.current = activeTaskId
    recordRef.current = record
  }, [state, prefs, activeTaskId, record])

  // Guards against handling the same expiry twice while effects catch up.
  const handledEndsAtRef = useRef<number | null>(null)

  const completeSession = useCallback((finished: TimerState) => {
    const current = prefsRef.current
    const next = otherMode(finished.mode)

    setCompletedMode(finished.mode)
    if (current.soundEnabled) playChime()
    if (current.notificationsEnabled) {
      showNotification(
        finished.mode === 'work' ? 'Odak oturumu tamamlandı' : 'Mola bitti',
        next === 'work' ? 'Yeniden odaklanma zamanı.' : 'Mola ver, hak ettin.',
      )
    }

    // Only focus sessions are recorded: a break is not focus time.
    if (finished.mode === 'work') {
      const completedAt = Date.now()
      recordRef.current({
        startedAt: new Date(finished.startedAt ?? completedAt - finished.durationMs).toISOString(),
        completedAt: new Date(completedAt).toISOString(),
        durationMinutes: Math.max(1, Math.round(finished.durationMs / 60_000)),
        taskId: activeTaskIdRef.current,
      })
    }

    dispatch({
      type: 'switchMode',
      mode: next,
      durationMs: minutesToMs(minutesForMode(next, current)),
    })
  }, [])

  const tick = useCallback(() => {
    const now = Date.now()
    const current = stateRef.current
    if (current.status !== 'running') return

    if (current.endsAt !== null && current.endsAt - now <= 0) {
      if (handledEndsAtRef.current === current.endsAt) return
      handledEndsAtRef.current = current.endsAt
      completeSession(current)
      return
    }

    dispatch({ type: 'tick', now })
  }, [completeSession])

  /* ---- Drive the countdown ---- */

  useEffect(() => {
    if (state.status !== 'running') return
    const id = window.setInterval(tick, TICK_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [state.status, tick])

  useEffect(() => {
    // Background tabs throttle intervals, so re-sync the moment we return.
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', tick)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', tick)
    }
  }, [tick])

  /* ---- Persistence ---- */

  useEffect(() => {
    writeJson(SESSION_KEY, state)
  }, [state])

  /* ---- An idle timer always reflects the configured length ---- */

  useEffect(() => {
    if (state.status !== 'idle') return
    const target = minutesToMs(minutesForMode(state.mode, prefs))
    if (state.durationMs === target) return
    dispatch({ type: 'setDuration', durationMs: target })
  }, [prefs, state.mode, state.status, state.durationMs])

  /* ---- Show the countdown in the browser tab ---- */

  const clock = formatClock(state.remainingMs)

  useEffect(() => {
    document.title =
      state.status === 'idle' ? BASE_TITLE : `${clock} · ${MODE_LABEL[state.mode]} — Steady`
    return () => {
      document.title = BASE_TITLE
    }
  }, [clock, state.status, state.mode])

  /* ---- Actions ---- */

  const start = useCallback(() => {
    unlockAudio()
    handledEndsAtRef.current = null
    setCompletedMode(null)
    dispatch({ type: 'start', now: Date.now() })
  }, [])

  const pause = useCallback(() => {
    dispatch({ type: 'pause', now: Date.now() })
  }, [])

  const reset = useCallback(() => {
    handledEndsAtRef.current = null
    setCompletedMode(null)
    dispatch({ type: 'reset' })
  }, [])

  const switchMode = useCallback((mode: TimerMode) => {
    handledEndsAtRef.current = null
    setCompletedMode(null)
    dispatch({
      type: 'switchMode',
      mode,
      durationMs: minutesToMs(minutesForMode(mode, prefsRef.current)),
    })
  }, [])

  const progress =
    state.durationMs > 0 ? Math.min(Math.max(1 - state.remainingMs / state.durationMs, 0), 1) : 0

  const value = useMemo<TimerContextValue>(
    () => ({
      mode: state.mode,
      status: state.status,
      durationMs: state.durationMs,
      remainingMs: state.remainingMs,
      progress,
      prefs,
      preferencesStatus,
      preferencesError,
      retryPreferences,
      completedMode,
      start,
      pause,
      reset,
      switchMode,
      setWorkMinutes,
      setBreakMinutes,
      setSoundEnabled,
      setNotificationsEnabled,
    }),
    [
      state.mode,
      state.status,
      state.durationMs,
      state.remainingMs,
      progress,
      prefs,
      preferencesStatus,
      preferencesError,
      retryPreferences,
      completedMode,
      start,
      pause,
      reset,
      switchMode,
      setWorkMinutes,
      setBreakMinutes,
      setSoundEnabled,
      setNotificationsEnabled,
    ],
  )

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
}
