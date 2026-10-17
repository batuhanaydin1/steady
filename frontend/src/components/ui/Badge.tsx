import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

export type BadgeTone = 'neutral' | 'accent' | 'info' | 'warning' | 'danger'

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}

/** Small status pill used for counts, states and labels. */
export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return <span className={cn('badge', `badge--${tone}`, className)}>{children}</span>
}
