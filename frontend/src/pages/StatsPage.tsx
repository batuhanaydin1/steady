import { useMemo } from 'react'
import { Button, Card, EmptyState } from '../components/ui/index.ts'
import { SessionLog } from '../features/sessions/SessionLog.tsx'
import { StatTile, StatTileSkeleton } from '../features/sessions/StatTile.tsx'
import { WeeklyChart } from '../features/sessions/WeeklyChart.tsx'
import { useSessions } from '../features/sessions/sessionsContext.ts'
import { formatMinutes, formatSessionCount } from '../features/sessions/sessions.ts'
import {
  averageSessionMinutes,
  lastDays,
  totalsForDay,
  totalsThisWeek,
} from '../features/sessions/stats.ts'

/**
 * Statistics: what the recorded sessions add up to.
 *
 * Every figure here is derived from the same list the log below shows, so the
 * summary and the detail can never disagree.
 */
export function StatsPage() {
  const { sessions, state, loadError, reload } = useSessions()

  const summary = useMemo(() => {
    const today = totalsForDay(sessions)
    return {
      today,
      week: totalsThisWeek(sessions),
      average: averageSessionMinutes(today),
      days: lastDays(sessions),
    }
  }, [sessions])

  if (state === 'error') {
    return (
      <div className="grid">
        <Card title="Statistics" subtitle="Focus time recorded by Steady">
          <EmptyState
            title="Could not load your statistics"
            description={loadError ?? 'The Steady API did not answer.'}
            action={
              <Button variant="secondary" size="sm" onClick={reload}>
                Try again
              </Button>
            }
          />
        </Card>
      </div>
    )
  }

  const loading = state === 'loading'
  const { today, week, average, days } = summary

  return (
    <div className="grid grid--stats">
      <Card title="Focus today">
        {loading ? (
          <StatTileSkeleton />
        ) : (
          <StatTile value={formatMinutes(today.minutes)} hint={formatSessionCount(today.sessions)} />
        )}
      </Card>

      <Card title="Sessions today">
        {loading ? (
          <StatTileSkeleton />
        ) : (
          <StatTile
            value={String(today.sessions)}
            hint={today.sessions === 0 ? 'None yet today' : `Averaging ${average} min`}
          />
        )}
      </Card>

      <Card title="Focus this week">
        {loading ? (
          <StatTileSkeleton />
        ) : (
          <StatTile
            value={formatMinutes(week.minutes)}
            hint={`${formatSessionCount(week.sessions)} since Monday`}
          />
        )}
      </Card>

      <Card
        className="grid__wide"
        title="Focus time per day"
        subtitle="Minutes focused each day"
      >
        <WeeklyChart days={days} loading={loading} />
      </Card>

      <Card
        className="grid__wide"
        title="Session history"
        subtitle="Newest first, grouped by day"
      >
        <SessionLog />
      </Card>
    </div>
  )
}
