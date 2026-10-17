import { useMemo } from 'react'
import { Button, EmptyState, Skeleton } from '../../components/ui/index.ts'
import { SessionRow } from './SessionRow.tsx'
import { useSessions } from './sessionsContext.ts'
import { describeHistory, formatMinutes, formatSessionCount, groupByDay } from './sessions.ts'

/**
 * The full session log, grouped by day with a per-day total. The Stats summary
 * cards and chart are built from these same sessions.
 */
export function SessionLog() {
  const { sessions, state, loadError, reload } = useSessions()
  const days = useMemo(() => groupByDay(sessions), [sessions])

  if (state === 'loading') {
    return (
      <div className="session-log" aria-busy="true" aria-label="Oturum geçmişi yükleniyor">
        {[0, 1].map((group) => (
          <section className="session-day" key={group}>
            <div className="session-day__header">
              <Skeleton height="16px" width="22%" />
              <Skeleton height="13px" width="16%" />
            </div>
            <ul className="session-list">
              {[0, 1].map((row) => (
                <li className="session session--skeleton" key={row}>
                  <Skeleton height="13px" width="18%" />
                  <Skeleton height="13px" width={row === 1 ? '36%' : '58%'} />
                  <Skeleton height="13px" width="14%" />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    )
  }

  if (state === 'error') {
    return (
      <EmptyState
        title="Oturum geçmişi yüklenemedi"
        description={loadError ?? 'Steady API\'si yanıt vermedi.'}
        action={
          <Button variant="secondary" size="sm" onClick={reload}>
            Tekrar dene
          </Button>
        }
      />
    )
  }

  if (days.length === 0) {
    return (
      <EmptyState
        title="Henüz kayıtlı oturum yok"
        description="Tamamladığın her odak oturumu, bağlı olduğu görevle birlikte burada saklanır."
      />
    )
  }

  return (
    <div className="session-log">
      {days.map((day) => (
        <section className="session-day" key={day.key}>
          <header className="session-day__header">
            <h3 className="session-day__label">{day.label}</h3>
            <p className="session-day__total">
              {formatMinutes(day.minutes)} · {formatSessionCount(day.sessions.length)}
            </p>
          </header>
          <ul className="session-list">
            {day.sessions.map((session) => (
              <SessionRow key={session.id} session={session} />
            ))}
          </ul>
        </section>
      ))}

      <p className="session__footnote">{describeHistory(sessions.length)}</p>
    </div>
  )
}
