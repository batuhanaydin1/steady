/**
 * Statistics derived from the recorded focus sessions.
 *
 * Everything is computed locally from the list the provider already holds, so
 * the totals on Stats always agree with the log below them — there is no second
 * source of truth to drift.
 *
 * Days are *local* calendar days: "today" means the day the user is living in,
 * not a UTC day that may have started or ended hours ago.
 */

import type { FocusSessionResponse } from '../../types/api.ts'
import { dayKey, localDayKey } from './sessions.ts'

export interface SessionTotals {
  /** Total focused minutes. */
  minutes: number
  /** Number of completed focus sessions. */
  sessions: number
}

const EMPTY: SessionTotals = { minutes: 0, sessions: 0 }

const WEEKDAY_FORMAT = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
const FULL_DAY_FORMAT = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export interface ChartDay extends SessionTotals {
  /** Local calendar day, `YYYY-MM-DD`. */
  key: string
  /** `Mon` — the short label under the bar. */
  weekday: string
  /** Day of the month, `17`. */
  dayOfMonth: number
  /** `Monday 17 October` — what a screen reader hears. */
  label: string
  isToday: boolean
}

/**
 * Sums the sessions whose local day falls between two `YYYY-MM-DD` keys,
 * inclusive. String comparison is enough because the keys sort chronologically.
 */
export function totalsBetween(
  sessions: readonly FocusSessionResponse[],
  fromKey: string,
  toKey: string,
): SessionTotals {
  let minutes = 0
  let count = 0

  for (const session of sessions) {
    const key = dayKey(session.completedAt)
    if (key !== '' && key >= fromKey && key <= toKey) {
      minutes += session.durationMinutes
      count += 1
    }
  }

  return count === 0 ? EMPTY : { minutes, sessions: count }
}

/** Totals for the local calendar day `date` falls on. */
export function totalsForDay(sessions: readonly FocusSessionResponse[], date = new Date()): SessionTotals {
  const key = localDayKey(date)
  return totalsBetween(sessions, key, key)
}

/** Monday of the week `date` falls in, at local midnight. */
export function startOfWeek(date = new Date()): Date {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  // getDay() puts Sunday first; shift it so Monday becomes day 0.
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  return monday
}

/** Totals from Monday of the current week up to `now`. */
export function totalsThisWeek(sessions: readonly FocusSessionResponse[], now = new Date()): SessionTotals {
  return totalsBetween(sessions, localDayKey(startOfWeek(now)), localDayKey(now))
}

/** The last `count` local days, oldest first and always `count` entries long. */
export function lastDays(
  sessions: readonly FocusSessionResponse[],
  count = 7,
  now = new Date(),
): ChartDay[] {
  const byKey = new Map<string, SessionTotals>()

  for (const session of sessions) {
    const key = dayKey(session.completedAt)
    if (key === '') continue

    const current = byKey.get(key)
    if (current) {
      current.minutes += session.durationMinutes
      current.sessions += 1
    } else {
      byKey.set(key, { minutes: session.durationMinutes, sessions: 1 })
    }
  }

  const todayKey = localDayKey(now)
  const days: ChartDay[] = []

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    date.setDate(date.getDate() - offset)

    const key = localDayKey(date)
    const totals = byKey.get(key) ?? EMPTY

    days.push({
      key,
      weekday: WEEKDAY_FORMAT.format(date),
      dayOfMonth: date.getDate(),
      label: FULL_DAY_FORMAT.format(date),
      isToday: key === todayKey,
      minutes: totals.minutes,
      sessions: totals.sessions,
    })
  }

  return days
}

/** Average focused minutes per session, rounded to the nearest minute. */
export function averageSessionMinutes(totals: SessionTotals): number {
  return totals.sessions === 0 ? 0 : Math.round(totals.minutes / totals.sessions)
}
