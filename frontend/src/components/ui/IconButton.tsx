import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn.ts'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: the button has no visible text. */
  label: string
  size?: 'sm' | 'md'
}

/** Square, icon-only button. Always requires an accessible `label`. */
export function IconButton({ label, size = 'md', className, type = 'button', children, ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={cn('icon-btn', `icon-btn--${size}`, className)}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}
