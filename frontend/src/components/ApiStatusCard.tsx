import { API_BASE_URL } from '../api/client.ts'
import { useApiHealth } from '../hooks/useApiHealth.ts'
import { Badge, Button, Card, Spinner } from './ui/index.ts'

/**
 * The connection panel: shows exactly what the API reports, with a retry
 * affordance. Handles loading, success and failure states.
 */
export function ApiStatusCard() {
  const { state, retry } = useApiHealth()

  return (
    <Card
      title="Bağlantı"
      subtitle={API_BASE_URL}
      actions={
        state.status === 'online' ? (
          <Badge tone="accent">Bağlı</Badge>
        ) : state.status === 'offline' ? (
          <Badge tone="danger">Bağlantı yok</Badge>
        ) : (
          <Badge tone="info">Kontrol ediliyor</Badge>
        )
      }
    >
      <div aria-live="polite">
        {state.status === 'checking' && (
          <p className="connection__line">
            <Spinner size={16} label="Steady API bağlantısı kontrol ediliyor" />
            <span className="connection__muted">Steady API'ye bağlanılıyor…</span>
          </p>
        )}

        {state.status === 'online' && (
          <dl className="connection__grid">
            <div>
              <dt>Servis</dt>
              <dd>{state.data.service}</dd>
            </div>
            <div>
              <dt>Sürüm</dt>
              <dd>{state.data.version}</dd>
            </div>
            <div>
              <dt>Durum</dt>
              <dd>{state.data.status}</dd>
            </div>
            <div>
              <dt>Kontrol zamanı</dt>
              <dd>
                <time dateTime={state.data.timestampUtc}>
                  {new Date(state.data.timestampUtc).toLocaleTimeString()}
                </time>
              </dd>
            </div>
          </dl>
        )}

        {state.status === 'offline' && (
          <div className="connection__error">
            <p className="connection__error-title">{state.message}</p>
            <p className="connection__muted">
              API'yi <code>backend/Steady.Api</code> içinde <code>dotnet run</code> ile başlatıp
              tekrar dene.
            </p>
            <Button variant="secondary" size="sm" onClick={retry}>
              Tekrar dene
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
