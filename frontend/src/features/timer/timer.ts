/**
 * Pure timer domain: types, limits, formatting and the reducer.
 *
 * Correctness rule: the countdown is always derived from an absolute
 * `endsAt` timestamp, never from decrementing a counter. That keeps it
 * accurate across re-renders, React StrictMode and background tabs, where
 * browsers throttle timers.
 */

export type TimerMode = 'work' | 'break'
export type TimerStatus = 'idle' | 'running' | 'paused'

export const WORK_MIN_MINUTES = 5
export const WORK_MAX_MINUTES = 120
export const BREAK_MIN_MINUTES = 1
export const BREAK_MAX_MINUTES = 30

export const WORK_PRESETS = [15, 25, 30, 45, 60, 90] as const

export const MODE_LABEL: Record<TimerMode, string> = {
  work: 'Odak',
  break: 'Mola',
}

export interface TimerPreferences {
  workMinutes: number
  breakMinutes: number
  soundEnabled: boolean
  notificationsEnabled: boolean
}

export const DEFAULT_PREFERENCES: TimerPreferences = {
  workMinutes: 25,
  breakMinutes: 5,
  soundEnabled: true,
  notificationsEnabled: false,
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function minutesToMs(minutes: number): number {
  return Math.round(minutes * 60_000)
}

export function clampWorkMinutes(minutes: number): number {
  return clamp(Math.round(minutes), WORK_MIN_MINUTES, WORK_MAX_MINUTES)
}

export function clampBreakMinutes(minutes: number): number {
  return clamp(Math.round(minutes), BREAK_MIN_MINUTES, BREAK_MAX_MINUTES)
}

/** `mm:ss` — minutes go up to 120, so they are not capped at 59. */
export function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function otherMode(mode: TimerMode): TimerMode {
  return mode === 'work' ? 'break' : 'work'
}

export function minutesForMode(mode: TimerMode, prefs: TimerPreferences): number {
  return mode === 'work' ? prefs.workMinutes : prefs.breakMinutes
}

/* ---------------------------------------------------------------------------
   State + reducer
   ------------------------------------------------------------------------- */

export interface TimerState {
  mode: TimerMode
  status: TimerStatus
  /** Total length of the current session. */
  durationMs: number
  /** Time left, as of the last tick/pause. */
  remainingMs: number
  /** Absolute end timestamp while running; null otherwise. */
  endsAt: number | null
  /**
   * When the user first pressed start for this session. Pausing does not move
   * it, so it is the real start of the session that gets recorded. Null while
   * the timer is idle.
   */
  startedAt: number | null
}

export type TimerAction =
  | { type: 'start'; now: number }
  | { type: 'pause'; now: number }
  | { type: 'reset' }
  | { type: 'tick'; now: number }
  | { type: 'switchMode'; mode: TimerMode; durationMs: number }
  | { type: 'setDuration'; durationMs: number }

function withRemaining(state: TimerState, remaining: number): TimerState {
  const clamped = clamp(remaining, 0, state.durationMs)
  return clamped === state.remainingMs ? state : { ...state, remainingMs: clamped }
}

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'start': {
      if (state.status === 'running' || state.remainingMs <= 0) return state
      return {
        ...state,
        status: 'running',
        endsAt: action.now + state.remainingMs,
        // A resume keeps the original start; a fresh start sets it.
        startedAt: state.startedAt ?? action.now,
      }
    }

    case 'pause': {
      if (state.status !== 'running' || state.endsAt === null) return state
      const remaining = clamp(state.endsAt - action.now, 0, state.durationMs)
      return { ...state, status: 'paused', remainingMs: remaining, endsAt: null }
    }

    case 'reset':
      return { ...state, status: 'idle', remainingMs: state.durationMs, endsAt: null, startedAt: null }

    case 'tick': {
      if (state.status !== 'running' || state.endsAt === null) return state
      return withRemaining(state, state.endsAt - action.now)
    }

    case 'switchMode':
      return {
        mode: action.mode,
        status: 'idle',
        durationMs: action.durationMs,
        remainingMs: action.durationMs,
        endsAt: null,
        startedAt: null,
      }

    case 'setDuration':
      if (state.status !== 'idle') return state
      if (state.durationMs === action.durationMs && state.remainingMs === action.durationMs) return state
      return { ...state, durationMs: action.durationMs, remainingMs: action.durationMs, endsAt: null }

    default:
      return state
  }
}

/** A brand new, idle timer for the given preferences. */
export function createInitialState(prefs: TimerPreferences): TimerState {
  const durationMs = minutesToMs(prefs.workMinutes)
  return { mode: 'work', status: 'idle', durationMs, remainingMs: durationMs, endsAt: null, startedAt: null }
}

/**
 * Restores a persisted session.
 *
 * A session that was running keeps running: the remaining time is recomputed
 * from `endsAt`, so closing or reloading the page never loses accuracy.
 */
export function hydrateState(persisted: unknown, prefs: TimerPreferences, now: number): TimerState {
  if (!persisted || typeof persisted !== 'object') return createInitialState(prefs)

  const raw = persisted as Partial<TimerState>
  const mode: TimerMode = raw.mode === 'break' ? 'break' : 'work'
  const fallbackDuration = minutesToMs(minutesForMode(mode, prefs))

  const durationMs =
    typeof raw.durationMs === 'number' && raw.durationMs > 0
      ? clamp(raw.durationMs, 60_000, minutesToMs(WORK_MAX_MINUTES))
      : fallbackDuration

  const status: TimerStatus =
    raw.status === 'running' || raw.status === 'paused' ? raw.status : 'idle'

  // State written before sessions were recorded has no `startedAt`; the best
  // reconstruction available is when the session must have begun.
  const startedAt =
    typeof raw.startedAt === 'number'
      ? raw.startedAt
      : status === 'running' && typeof raw.endsAt === 'number'
        ? raw.endsAt - durationMs
        : null

  if (status === 'running' && typeof raw.endsAt === 'number') {
    return {
      mode,
      status: 'running',
      durationMs,
      remainingMs: clamp(raw.endsAt - now, 0, durationMs),
      endsAt: raw.endsAt,
      startedAt,
    }
  }

  const remainingMs =
    typeof raw.remainingMs === 'number' ? clamp(raw.remainingMs, 0, durationMs) : durationMs

  return {
    mode,
    status: status === 'running' ? 'paused' : status,
    durationMs,
    remainingMs,
    endsAt: null,
    startedAt,
  }
}