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
        <Card title="İstatistikler" subtitle="Steady ile kaydedilen odak süresi">
          <EmptyState
            title="İstatistikler yüklenemedi"
            description={loadError ?? 'Steady API yanıt vermedi.'}
            action={
              <Button variant="secondary" size="sm" onClick={reload}>
                Tekrar dene
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
      <Card title="Bugünkü odak">
        {loading ? (
          <StatTileSkeleton />
        ) : (
          <StatTile value={formatMinutes(today.minutes)} hint={formatSessionCount(today.sessions)} />
        )}
      </Card>

      <Card title="Bugünkü oturumlar">
        {loading ? (
          <StatTileSkeleton />
        ) : (
          <StatTile
            value={String(today.sessions)}
            hint={today.sessions === 0 ? 'Bugün henüz yok' : `Ortalama ${average} dk`}
          />
        )}
      </Card>

      <Card title="Bu haftaki odak">
        {loading ? (
          <StatTileSkeleton />
        ) : (
          <StatTile
            value={formatMinutes(week.minutes)}
            hint={`Pazartesi'den beri ${formatSessionCount(week.sessions)}`}
          />
        )}
      </Card>

      <Card
        className="grid__wide"
        title="Günlük odak süresi"
        subtitle="Her gün odaklanılan dakika"
      >
        <WeeklyChart days={days} loading={loading} />
      </Card>

      <Card
        className="grid__wide"
        title="Oturum geçmişi"
        subtitle="En yeni önce, güne göre gruplu"
      >
        <SessionLog />
      </Card>
    </div>
  )
}
