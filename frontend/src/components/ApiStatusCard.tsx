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
      title="Connection"
      subtitle={API_BASE_URL}
      actions={
        state.status === 'online' ? (
          <Badge tone="accent">Connected</Badge>
        ) : state.status === 'offline' ? (
          <Badge tone="danger">Offline</Badge>
        ) : (
          <Badge tone="info">Checking</Badge>
        )
      }
    >
      <div aria-live="polite">
        {state.status === 'checking' && (
          <p className="connection__line">
            <Spinner size={16} label="Checking the Steady API connection" />
            <span className="connection__muted">Contacting the Steady API…</span>
          </p>
        )}

        {state.status === 'online' && (
          <dl className="connection__grid">
            <div>
              <dt>Service</dt>
              <dd>{state.data.service}</dd>
            </div>
            <div>
              <dt>Version</dt>
              <dd>{state.data.version}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{state.data.status}</dd>
            </div>
            <div>
              <dt>Checked at</dt>
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
              Start the API with <code>dotnet run</code> inside <code>backend/Steady.Api</code>{' '}
              and try again.
            </p>
            <Button variant="secondary" size="sm" onClick={retry}>
              Retry
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
