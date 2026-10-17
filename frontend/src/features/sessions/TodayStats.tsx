import { useMemo } from 'react'
import { StatTile, StatTileSkeleton } from './StatTile.tsx'
import { useSessions } from './sessionsContext.ts'
import { formatMinutes } from './sessions.ts'
import { totalsForDay } from './stats.ts'

/**
 * Today's focus time and session count for the Focus screen. Both figures come
 * from the same recorded sessions Stats reads, so the two screens cannot
 * disagree.
 */
export function TodayStats() {
  const { sessions, state } = useSessions()
  const today = useMemo(() => totalsForDay(sessions), [sessions])

  if (state === 'loading') {
    return (
      <div className="stat-grid">
        <StatTileSkeleton />
        <StatTileSkeleton />
      </div>
    )
  }

  if (state === 'error') {
    return <p className="stat__hint">Unavailable while the Steady API is offline.</p>
  }

  return (
    <div className="stat-grid">
      <StatTile value={formatMinutes(today.minutes)} hint="Focused" />
      <StatTile value={String(today.sessions)} hint={today.sessions === 1 ? 'Session' : 'Sessions'} />
    </div>
  )
}
