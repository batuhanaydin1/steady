import { Button, Card, EmptyState, Notice, Skeleton } from '../../components/ui/index.ts'
import { SessionRow } from './SessionRow.tsx'
import { useSessions } from './sessionsContext.ts'
import { describeHistory } from './sessions.ts'

interface SessionHistoryCardProps {
  onOpenStats: () => void
}

/** How many sessions the Focus screen shows before sending you to Stats. */
const RECENT_LIMIT = 5

/**
 * Short session history for the Focus screen. The full log, grouped by day,
 * lives on the Stats screen.
 */
export function SessionHistoryCard({ onOpenStats }: SessionHistoryCardProps) {
  const { sessions, state, loadError, reload, unsaved, retryRecord, dismissUnsaved } = useSessions()
  const recent = sessions.slice(0, RECENT_LIMIT)

  return (
    <Card
      title="Geçmiş"
      subtitle="Son odak oturumların"
      footer={
        sessions.length > RECENT_LIMIT ? (
          <Button variant="ghost" size="sm" onClick={onOpenStats}>
            Tüm oturumları gör
          </Button>
        ) : undefined
      }
    >
      {unsaved ? (
        <Notice
          tone="danger"
          role="alert"
          action={
            <>
              <button type="button" className="notice__action" onClick={retryRecord}>
                Tekrar dene
              </button>
              <button type="button" className="notice__action" onClick={dismissUnsaved}>
                Yok say
              </button>
            </>
          }
        >
          Son oturumun kaydedilemedi.
        </Notice>
      ) : null}

      {state === 'loading' ? (
        <ul className="session-list" aria-busy="true" aria-label="Oturum geçmişi yükleniyor">
          {[0, 1, 2].map((index) => (
            <li className="session session--skeleton" key={index}>
              <Skeleton height="13px" width="18%" />
              <Skeleton height="13px" width={index === 1 ? '40%' : '62%'} />
              <Skeleton height="13px" width="14%" />
            </li>
          ))}
        </ul>
      ) : null}

      {state === 'error' ? (
        <EmptyState
          title="Oturum geçmişi yüklenemedi"
          description={loadError ?? 'Steady API\'si yanıt vermedi.'}
          action={
            <Button variant="secondary" size="sm" onClick={reload}>
              Tekrar dene
            </Button>
          }
        />
      ) : null}

      {state === 'ready' && recent.length === 0 ? (
        <EmptyState
          title="Henüz oturum yok"
          description="Bir odak oturumu tamamla, kaydı burada görünecek."
        />
      ) : null}

      {state === 'ready' && recent.length > 0 ? (
        <ul className="session-list">
          {recent.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </ul>
      ) : null}

      {state === 'ready' && sessions.length > 0 ? (
        <p className="session__footnote">{describeHistory(sessions.length)}</p>
      ) : null}
    </Card>
  )
}
