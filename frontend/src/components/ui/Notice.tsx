import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

export type NoticeTone = 'accent' | 'info' | 'danger'

interface NoticeProps {
  tone?: NoticeTone
  /** `alert` interrupts the screen reader; `status` waits for a pause. */
  role?: 'status' | 'alert'
  /** Optional trailing control, such as a dismiss button. */
  action?: ReactNode
  className?: string
  children: ReactNode
}

/** Short, inline status message used for confirmations and recoverable errors. */
export function Notice({ tone = 'accent', role = 'status', action, className, children }: NoticeProps) {
  return (
    <p className={cn('notice', `notice--${tone}`, className)} role={role}>
      <span>{children}</span>
      {action}
    </p>
  )
}
