import { ApiStatusCard } from '../components/ApiStatusCard.tsx'
import { ThemeToggle } from '../components/layout/ThemeToggle.tsx'
import { Badge, Card, Skeleton } from '../components/ui/index.ts'

/** Timer preferences are persisted from Phase 8. */
export function SettingsPage() {
  return (
    <div className="grid grid--settings">
      <Card
        title="Görünüm"
        subtitle="Bu cihaza kaydedilir, sonraki ziyaretinde geri yüklenir"
      >
        <div className="setting-row">
          <div>
            <p className="setting-row__label">Renk teması</p>
            <p className="setting-row__hint">Koyu ve açık Steady teması arasında geçiş yap.</p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      <ApiStatusCard />

      <Card
        title="Zamanlayıcı varsayılanları"
        subtitle="Odak süresi, mola süresi ve uyarılar"
        actions={<Badge tone="neutral">Aşama 8</Badge>}
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
          Bu tercihler PostgreSQL'de saklanır, böylece seninle birlikte kalır.
        </p>
      </Card>
    </div>
  )
}
