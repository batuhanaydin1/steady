import { cn } from '../../utils/cn.ts'

interface SpinnerProps {
  size?: number
  className?: string
  label?: string
}

/** Indeterminate loading indicator that inherits the current text colour. */
export function Spinner({ size = 18, className, label }: SpinnerProps) {
  return (
    <svg
      className={cn('spinner', className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role={label ? 'img' : 'presentation'}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      focusable="false"
    >
      <circle className="spinner__track" cx="12" cy="12" r="9" />
      <circle className="spinner__head" cx="12" cy="12" r="9" />
    </svg>
  )
}
