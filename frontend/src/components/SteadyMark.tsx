import { useId } from 'react'
import { cn } from '../utils/cn.ts'

interface SteadyMarkProps {
  size?: number
  title?: string
  className?: string
}

/** The Steady logo: a focus ring with a progress arc. */
export function SteadyMark({ size = 32, title, className }: SteadyMarkProps) {
  const gradientId = useId()

  return (
    <svg
      className={cn('steady-mark', className)}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--info)" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="19" fill="none" stroke="var(--border)" strokeWidth="6" />
      <circle
        cx="32"
        cy="32"
        r="19"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="89 119.4"
        transform="rotate(-90 32 32)"
      />
      <circle cx="32" cy="32" r="5" fill={`url(#${gradientId})`} />
    </svg>
  )
}
