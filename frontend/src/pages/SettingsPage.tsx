import { ApiStatusCard } from '../components/ApiStatusCard.tsx'
import { ThemeToggle } from '../components/layout/ThemeToggle.tsx'
import { Card } from '../components/ui/index.ts'
import { TimerSettings } from '../features/timer/TimerSettings.tsx'

/**
 * Settings: appearance (a device-local choice), the API connection, and the
 * timer preferences that are stored in PostgreSQL. The timer card is the same
 * component the Focus screen shows, so both screens read one source of truth.
 */
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

      <TimerSettings />
    </div>
  )
}
