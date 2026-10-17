/**
 * Pure helpers for presenting session history: durations, grouping by day and
 * the labels used in both the Focus screen's short list and the Stats log.
 */

import type { FocusSessionResponse } from '../../types/api.ts'

const TIME_FORMAT = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' })
const DAY_FORMAT = new Intl.DateTimeFormat('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })

/**
 * How many recent sessions the app loads in a single request. It bounds the
 * session log *and* the statistics, which are computed from the same list, so
 * screens that show totals say so when the window is full.
 */
export const HISTORY_LIMIT = 100

/** `25 dk`, `1 sa`, `1 sa 30 dk` — hours only when they are needed. */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} dk`

  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} sa` : `${hours} sa ${rest} dk`
}

export function formatTime(iso: string): string {
  const timestamp = Date.parse(iso)
  return Number.isNaN(timestamp) ? '' : TIME_FORMAT.format(timestamp)
}

export function formatSessionCount(count: number): string {
  return `${count} oturum`
}

/**
 * How much of the history is on screen: a plain count, or the fetch window when
 * the list is full. Steady does not pretend to have loaded everything.
 */
export function describeHistory(count: number): string {
  return count >= HISTORY_LIMIT
    ? `Son ${HISTORY_LIMIT} oturum gösteriliyor.`
    : `${formatSessionCount(count)} kayıtlı.`
}

/** A local calendar date as `YYYY-MM-DD`, which also sorts chronologically. */
export function localDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** Local calendar day of a timestamp, as `YYYY-MM-DD`. */
export function dayKey(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : localDayKey(date)
}

/** `Bugün`, `Dün` or `Cum 17 Eki`, relative to `now`. */
export function dayLabel(iso: string, now = new Date()): string {
  const key = dayKey(iso)
  if (key === '') return ''

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const asDate = new Date(iso)
  const day = new Date(asDate.getFullYear(), asDate.getMonth(), asDate.getDate())

  if (key === localDayKey(today)) return 'Bugün'
  if (key === localDayKey(yesterday)) return 'Dün'
  return DAY_FORMAT.format(day)
}

export interface SessionDay {
  key: string
  label: string
  /** Total focused minutes recorded that day. */
  minutes: number
  sessions: FocusSessionResponse[]
}

/**
 * Groups sessions by local calendar day, newest day first. Sessions are
 * expected to arrive newest first, which is the order the API returns.
 */
export function groupByDay(sessions: readonly FocusSessionResponse[]): SessionDay[] {
  const days: SessionDay[] = []

  for (const session of sessions) {
    const key = dayKey(session.completedAt)
    const current = days.length > 0 ? days[days.length - 1] : undefined

    if (current && current.key === key) {
      current.sessions.push(session)
      current.minutes += session.durationMinutes
      continue
    }

    days.push({
      key,
      label: dayLabel(session.completedAt),
      minutes: session.durationMinutes,
      sessions: [session],
    })
  }

  return days
}
