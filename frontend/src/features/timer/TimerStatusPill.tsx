import { cn } from '../../utils/cn.ts'
import { useTimer } from './timerContext.ts'
import { formatClock, MODE_LABEL } from './timer.ts'

/**
 * Header indicator that keeps the running countdown visible on every screen.
 * It links back to the timer, so clicking it is always useful.
 */
export function TimerStatusPill() {
  const { status, mode, remainingMs } = useTimer()

  if (status === 'idle') return null

  const minutesLeft = Math.ceil(remainingMs / 60_000)

  return (
    <a
      className={cn('timer-pill', `timer-pill--${status}`)}
      href="#/focus"
      aria-label={`${MODE_LABEL[mode]} ${status === 'paused' ? 'duraklatıldı' : 'çalışıyor'}, ${minutesLeft} dakika kaldı. Zamanlayıcıya git.`}
    >
      <span className="timer-pill__dot" aria-hidden="true" />
      <span className="timer-pill__label">{MODE_LABEL[mode]}</span>
      <span className="timer-pill__time">{formatClock(remainingMs)}</span>
    </a>
  )
}
