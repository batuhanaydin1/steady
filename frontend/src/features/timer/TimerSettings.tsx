import { Button, Card, Notice, Switch } from '../../components/ui/index.ts'
import { notificationsGranted } from './alert.ts'
import { DurationStepper } from './DurationStepper.tsx'
import { useTimer } from './timerContext.ts'
import { BREAK_MAX_MINUTES, BREAK_MIN_MINUTES, WORK_MAX_MINUTES, WORK_MIN_MINUTES } from './timer.ts'

/**
 * Length and alert preferences.
 *
 * They are stored in the Steady database, but the timer never waits for it: the
 * device copy is used at once, the stored copy is adopted when it arrives, and a
 * change the API refuses stays here until it can be pushed again.
 */
export function TimerSettings() {
  const {
    prefs,
    status,
    preferencesStatus,
    preferencesError,
    retryPreferences,
    setWorkMinutes,
    setBreakMinutes,
    setSoundEnabled,
    setNotificationsEnabled,
  } = useTimer()

  const locked = status !== 'idle'
  // The saved preference is the user's intent; delivering it needs this browser's
  // permission, which is why the two can disagree.
  const notificationsBlocked = prefs.notificationsEnabled && !notificationsGranted()

  return (
    <Card
      className="timer-settings"
      title="Zamanlayıcı ayarları"
      subtitle={
        preferencesStatus === 'synced' ? 'Steady veritabanına kaydedildi' : 'Bu cihaza kaydedildi'
      }
    >
      <DurationStepper
        label="Odak süresi"
        value={prefs.workMinutes}
        min={WORK_MIN_MINUTES}
        max={WORK_MAX_MINUTES}
        onChange={setWorkMinutes}
        disabled={locked}
      />
      <DurationStepper
        label="Mola süresi"
        value={prefs.breakMinutes}
        min={BREAK_MIN_MINUTES}
        max={BREAK_MAX_MINUTES}
        onChange={setBreakMinutes}
        disabled={locked}
      />

      <div className="timer-settings__switches">
        <Switch
          label="Sesli uyarı"
          hint="Oturum bittiğinde zil sesi çalar."
          checked={prefs.soundEnabled}
          onChange={setSoundEnabled}
        />
        <Switch
          label="Masaüstü bildirimi"
          hint={
            notificationsBlocked
              ? 'Bu tarayıcı henüz bildirimlere izin vermedi.'
              : 'Tarayıcı bir kez izin isteyecek.'
          }
          checked={prefs.notificationsEnabled}
          onChange={setNotificationsEnabled}
        />
      </div>

      {preferencesError ? (
        <Notice
          tone="danger"
          action={
            <Button variant="ghost" size="sm" onClick={retryPreferences}>
              Tekrar dene
            </Button>
          }
        >
          {preferencesError}
        </Notice>
      ) : null}

      {locked ? (
        <p className="placeholder-note placeholder-note--sm">
          Oturum sürerken süreyi değiştirmek için zamanlayıcıyı sıfırla.
        </p>
      ) : null}
    </Card>
  )
}
