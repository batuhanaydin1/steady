import { useEffect, useRef } from 'react'
import { Badge, Button, Card, Notice, SegmentedControl } from '../../components/ui/index.ts'
import { cn } from '../../utils/cn.ts'
import { ProgressRing } from './ProgressRing.tsx'
import { useTimer } from './timerContext.ts'
import { formatClock, MODE_LABEL, WORK_PRESETS } from './timer.ts'
import type { TimerMode } from './timer.ts'

const MODE_OPTIONS = [
  { value: 'work', label: 'Odak' },
  { value: 'break', label: 'Mola' },
] as const

const STATUS_LABEL = {
  idle: 'Hazır',
  running: 'Çalışıyor',
  paused: 'Duraklatıldı',
} as const

function PlayIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true" focusable="false">
      <path d="M1.5 1.4 11 7l-9.5 5.6z" fill="currentColor" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true" focusable="false">
      <path d="M1.5 1.5h3v11h-3zM7.5 1.5h3v11h-3z" fill="currentColor" />
    </svg>
  )
}

/**
 * The focus timer: mode switch, circular progress, controls and quick presets.
 * All state lives in TimerProvider so the session survives navigation.
 */
export function TimerPanel() {
  const {
    mode,
    status,
    durationMs,
    remainingMs,
    progress,
    prefs,
    completedMode,
    start,
    pause,
    reset,
    switchMode,
    setWorkMinutes,
  } = useTimer()

  const running = status === 'running'
  const idle = status === 'idle'
  const nothingToReset = status === 'idle' && remainingMs === durationMs
  const primaryLabel = running ? 'Duraklat' : status === 'paused' ? 'Devam et' : 'Başlat'

  // Keyboard shortcuts read the freshest handlers without re-binding.
  const actionsRef = useRef({ primary: () => {}, reset: () => {} })
  useEffect(() => {
    actionsRef.current = { primary: running ? pause : start, reset }
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      // Never hijack typing or a focused control.
      const target = event.target
      if (target instanceof Element && target.closest('input, textarea, select, button, a, [contenteditable="true"]')) {
        return
      }

      if (event.code === 'Space') {
        event.preventDefault()
        actionsRef.current.primary()
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault()
        actionsRef.current.reset()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <Card
      className="grid__main"
      title={mode === 'work' ? 'Odak oturumu' : 'Mola'}
      subtitle={
        mode === 'work'
          ? 'Derin çalışma, her seferinde tek oturum'
          : 'Biraz uzaklaş, sonra dinç dön'
      }
      actions={<Badge tone={running ? 'accent' : 'neutral'}>{STATUS_LABEL[status]}</Badge>}
    >
      <div className="timer">
        <SegmentedControl<TimerMode>
          label="Zamanlayıcı modu"
          options={MODE_OPTIONS}
          value={mode}
          onChange={switchMode}
        />

        <ProgressRing progress={progress} status={status}>
          <p className="ring__mode">{MODE_LABEL[mode]}</p>
          <p className="ring__time" role="timer" aria-label="Kalan süre">
            {formatClock(remainingMs)}
          </p>
          <p className="ring__state">{STATUS_LABEL[status]}</p>
        </ProgressRing>

        <p className="sr-only" aria-live="polite">
          {`${MODE_LABEL[mode]} ${STATUS_LABEL[status].toLowerCase()}. ${Math.ceil(remainingMs / 60000)} dakika kaldı.`}
        </p>

        <div className="timer__controls">
          <Button
            size="lg"
            onClick={running ? pause : start}
            icon={running ? <PauseIcon /> : <PlayIcon />}
          >
            {primaryLabel}
          </Button>
          <Button size="lg" variant="ghost" onClick={reset} disabled={nothingToReset}>
            Sıfırla
          </Button>
        </div>

        {mode === 'work' && (
          <div className="timer__presets">
            <span className="timer__presets-label">Hazır süreler</span>
            <div className="timer__presets-row">
              {WORK_PRESETS.map((minutes) => {
                const active = prefs.workMinutes === minutes
                return (
                  <button
                    key={minutes}
                    type="button"
                    className={cn('preset', active && 'preset--active')}
                    aria-pressed={active}
                    disabled={!idle}
                    onClick={() => setWorkMinutes(minutes)}
                  >
                    {minutes} dk
                  </button>
                )
              })}
            </div>
            <p className="timer__hint">
              {idle
                ? 'Ya da süreyi Zamanlayıcı ayarlarından ince ayarla. Kısayollar: Başlatmak veya duraklatmak için Boşluk, sıfırlamak için R.'
                : 'Süreyi değiştirmek için zamanlayıcıyı sıfırla.'}
            </p>
          </div>
        )}

        {completedMode ? (
          <Notice tone={completedMode === 'work' ? 'accent' : 'info'}>
            {completedMode === 'work'
              ? `Odak oturumu tamamlandı — ${prefs.breakMinutes} dakikalık mola hazır.`
              : 'Mola bitti — sıradaki odak oturumuna hazır mısın?'}
          </Notice>
        ) : null}
      </div>
    </Card>
  )
}
