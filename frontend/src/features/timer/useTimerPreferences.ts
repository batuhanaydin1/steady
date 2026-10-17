import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '../../api/client.ts'
import { getTimerPreferences, updateTimerPreferences } from '../../api/preferences.ts'
import type { TimerPreferencesResponse, UpdateTimerPreferencesRequest } from '../../types/api.ts'
import { readJson, writeJson } from '../../utils/storage.ts'
import { ensureNotificationPermission, unlockAudio } from './alert.ts'
import { clampBreakMinutes, clampWorkMinutes, DEFAULT_PREFERENCES } from './timer.ts'
import type { TimerPreferences } from './timer.ts'

/**
 * Cached copy of the preferences.
 *
 * The database holds the real thing; this cache is what lets the timer paint
 * instantly and keep working when the API is unreachable.
 */
const PREFS_KEY = 'steady.timer.prefs'

/**
 * Set while this device holds changes the API has not accepted yet. The next
 * visit then pushes them instead of overwriting them with the stored copy —
 * closing the window where a closed tab could silently undo an edit.
 */
const PENDING_KEY = 'steady.timer.prefs.pending'

export type PreferencesStatus = 'loading' | 'synced' | 'offline'

/** A load has to be retried with a GET and a failed save with a PUT. */
interface Failure {
  kind: 'load' | 'save'
  message: string
}

export interface TimerPreferencesHandle {
  prefs: TimerPreferences
  /** Whether the settings in use are the ones the API holds. */
  status: PreferencesStatus
  /** Why the API copy is not in use, when `status` is `offline`. */
  error: string | null
  setWorkMinutes: (minutes: number) => void
  setBreakMinutes: (minutes: number) => void
  setSoundEnabled: (enabled: boolean) => void
  setNotificationsEnabled: (enabled: boolean) => void
  /** Retries whichever step failed. */
  retry: () => void
}

function messageFor(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function readLocalPreferences(): TimerPreferences {
  const stored = readJson<Partial<TimerPreferences>>(PREFS_KEY, {})
  return {
    workMinutes: clampWorkMinutes(stored.workMinutes ?? DEFAULT_PREFERENCES.workMinutes),
    breakMinutes: clampBreakMinutes(stored.breakMinutes ?? DEFAULT_PREFERENCES.breakMinutes),
    soundEnabled: stored.soundEnabled ?? DEFAULT_PREFERENCES.soundEnabled,
    notificationsEnabled: stored.notificationsEnabled ?? DEFAULT_PREFERENCES.notificationsEnabled,
  }
}

/** Clamped on the way in as well: the API is another writer, not a trusted one. */
function fromResponse(response: TimerPreferencesResponse): TimerPreferences {
  return {
    workMinutes: clampWorkMinutes(response.workMinutes),
    breakMinutes: clampBreakMinutes(response.breakMinutes),
    soundEnabled: response.soundEnabled,
    notificationsEnabled: response.notificationsEnabled,
  }
}

function toRequest(prefs: TimerPreferences): UpdateTimerPreferencesRequest {
  return {
    workMinutes: prefs.workMinutes,
    breakMinutes: prefs.breakMinutes,
    soundEnabled: prefs.soundEnabled,
    notificationsEnabled: prefs.notificationsEnabled,
  }
}

/**
 * Owns the timer preferences: a device cache in front of the API copy.
 *
 * Reads are optimistic — the cached value is used immediately and the stored one
 * is adopted when it arrives — and writes are best-effort. A change that the API
 * refuses is never dropped: it stays on the device, is remembered as pending, and
 * is pushed again on the next visit or from the retry button.
 */
export function useTimerPreferences(): TimerPreferencesHandle {
  const [prefs, setPrefs] = useState<TimerPreferences>(readLocalPreferences)
  const [status, setStatus] = useState<PreferencesStatus>('loading')
  const [failure, setFailure] = useState<Failure | null>(null)
  const [attempt, setAttempt] = useState(0)

  // The committed values, so an event handler never works from a stale render.
  const prefsRef = useRef(prefs)
  const pendingRef = useRef(readJson<boolean>(PENDING_KEY, false))
  // Set once the user edits, so a slow load cannot undo what they just chose.
  const editedRef = useRef(false)
  // Orders overlapping saves: only the newest one may report its result.
  const saveTokenRef = useRef(0)

  const remember = useCallback((next: TimerPreferences) => {
    prefsRef.current = next
    setPrefs(next)
    writeJson(PREFS_KEY, next)
  }, [])

  const save = useCallback(async (next: TimerPreferences, signal?: AbortSignal) => {
    const token = saveTokenRef.current + 1
    saveTokenRef.current = token

    try {
      await updateTimerPreferences(toRequest(next), signal)
      if (saveTokenRef.current !== token) return

      pendingRef.current = false
      writeJson(PENDING_KEY, false)
      setFailure(null)
      setStatus('synced')
    } catch (error) {
      if (saveTokenRef.current !== token || isAbortError(error)) return

      setStatus('offline')
      setFailure({
        kind: 'save',
        message: messageFor(error, 'Zamanlayıcı ayarları kaydedilemedi.'),
      })
    }
  }, [])

  /**
   * Applies a change locally first, so the timer never waits on the network, and
   * marks it pending until the API accepts it.
   */
  const commit = useCallback(
    (patch: Partial<TimerPreferences>) => {
      const next = { ...prefsRef.current, ...patch }
      editedRef.current = true
      pendingRef.current = true
      writeJson(PENDING_KEY, true)
      remember(next)
      void save(next)
    },
    [remember, save],
  )

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    const pull = async () => {
      try {
        const stored = await getTimerPreferences(controller.signal)
        if (!active) return

        setFailure(null)
        setStatus('synced')
        // A change made while this was in flight outranks what it returned.
        if (!editedRef.current) remember(fromResponse(stored))
      } catch (error) {
        if (!active || isAbortError(error)) return

        setStatus('offline')
        setFailure({
          kind: 'load',
          message: messageFor(error, 'Kayıtlı zamanlayıcı ayarları yüklenemedi.'),
        })
      }
    }

    // Pending changes win: they were made after the last save that succeeded.
    void (pendingRef.current ? save(prefsRef.current, controller.signal) : pull())

    return () => {
      active = false
      controller.abort()
    }
  }, [attempt, remember, save])

  const retry = useCallback(() => {
    if (failure?.kind === 'load') {
      setStatus('loading')
      setFailure(null)
      setAttempt((value) => value + 1)
      return
    }

    void save(prefsRef.current)
  }, [failure, save])

  const setWorkMinutes = useCallback(
    (minutes: number) => commit({ workMinutes: clampWorkMinutes(minutes) }),
    [commit],
  )

  const setBreakMinutes = useCallback(
    (minutes: number) => commit({ breakMinutes: clampBreakMinutes(minutes) }),
    [commit],
  )

  const setSoundEnabled = useCallback(
    (enabled: boolean) => {
      // Browsers only unlock audio from a user gesture, and this is one.
      if (enabled) unlockAudio()
      commit({ soundEnabled: enabled })
    },
    [commit],
  )

  const setNotificationsEnabled = useCallback(
    (enabled: boolean) => {
      if (!enabled) {
        commit({ notificationsEnabled: false })
        return
      }

      // Ask only when the user opts in, and store the preference only if the
      // browser actually grants it.
      void ensureNotificationPermission().then((granted) => {
        if (granted) commit({ notificationsEnabled: true })
      })
    },
    [commit],
  )

  return {
    prefs,
    status,
    error: failure?.message ?? null,
    setWorkMinutes,
    setBreakMinutes,
    setSoundEnabled,
    setNotificationsEnabled,
    retry,
  }
}
