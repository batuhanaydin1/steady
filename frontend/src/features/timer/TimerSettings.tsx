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
      title="Timer settings"
      subtitle={
        preferencesStatus === 'synced' ? 'Saved to your Steady database' : 'Saved on this device'
      }
    >
      <DurationStepper
        label="Focus length"
        value={prefs.workMinutes}
        min={WORK_MIN_MINUTES}
        max={WORK_MAX_MINUTES}
        onChange={setWorkMinutes}
        disabled={locked}
      />
      <DurationStepper
        label="Break length"
        value={prefs.breakMinutes}
        min={BREAK_MIN_MINUTES}
        max={BREAK_MAX_MINUTES}
        onChange={setBreakMinutes}
        disabled={locked}
      />

      <div className="timer-settings__switches">
        <Switch
          label="Sound alert"
          hint="A short chime when a session ends."
          checked={prefs.soundEnabled}
          onChange={setSoundEnabled}
        />
        <Switch
          label="Desktop notification"
          hint={
            notificationsBlocked
              ? 'This browser has not allowed notifications yet.'
              : 'Your browser will ask for permission once.'
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
              Try again
            </Button>
          }
        >
          {preferencesError}
        </Notice>
      ) : null}

      {locked ? (
        <p className="placeholder-note placeholder-note--sm">
          Reset the timer to change its length while a session is in progress.
        </p>
      ) : null}
    </Card>
  )
}
