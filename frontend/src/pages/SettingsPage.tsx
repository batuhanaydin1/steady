import { ApiStatusCard } from '../components/ApiStatusCard.tsx'
import { ThemeToggle } from '../components/layout/ThemeToggle.tsx'
import { Badge, Card, Skeleton } from '../components/ui/index.ts'

/** Timer preferences are persisted from Phase 8. */
export function SettingsPage() {
  return (
    <div className="grid grid--settings">
      <Card
        title="Appearance"
        subtitle="Saved on this device and restored on your next visit"
      >
        <div className="setting-row">
          <div>
            <p className="setting-row__label">Colour theme</p>
            <p className="setting-row__hint">Switch between the dark and light Steady themes.</p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      <ApiStatusCard />

      <Card
        title="Timer defaults"
        subtitle="Work length, break length and alerts"
        actions={<Badge tone="neutral">Phase 8</Badge>}
      >
        <div className="list-placeholder" aria-hidden="true">
          {[0, 1, 2].map((row) => (
            <div key={row} className="setting-row">
              <Skeleton height="14px" width="46%" />
              <Skeleton height="34px" width="120px" />
            </div>
          ))}
        </div>
        <p className="placeholder-note placeholder-note--sm">
          These preferences are stored in PostgreSQL so they follow you between sessions.
        </p>
      </Card>
    </div>
  )
}
