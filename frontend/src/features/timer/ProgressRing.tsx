import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'
import { clamp } from './timer.ts'
import type { TimerStatus } from './timer.ts'

const RADIUS = 45
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface ProgressRingProps {
  /** Elapsed fraction, 0 → 1. */
  progress: number
  status: TimerStatus
  children: ReactNode
}

/**
 * SVG progress ring. The ring itself is decorative; the countdown is rendered
 * as text inside it so screen readers announce real content.
 */
export function ProgressRing({ progress, status, children }: ProgressRingProps) {
  const offset = CIRCUMFERENCE * (1 - clamp(progress, 0, 1))

  return (
    <div className={cn('ring', `ring--${status}`)}>
      <svg className="ring__svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle className="ring__track" cx="50" cy="50" r={RADIUS} />
        <circle
          className="ring__progress"
          cx="50"
          cy="50"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring__content">{children}</div>
    </div>
  )
}
