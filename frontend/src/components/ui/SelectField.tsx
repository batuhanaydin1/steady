import { useId } from 'react'
import type { ReactNode, SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn.ts'

export interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string
  hint?: ReactNode
  error?: string | null
  /** Visually hides the label while keeping it for screen readers. */
  hideLabel?: boolean
}

/**
 * Labelled native `<select>`. Native keeps keyboard support and the platform
 * picker on touch devices for free; only the styling is ours.
 */
export function SelectField({
  label,
  hint,
  error,
  hideLabel = false,
  className,
  children,
  ...rest
}: SelectFieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={cn('field', error && 'field--invalid', className)}>
      <label className={cn('field__label', hideLabel && 'sr-only')} htmlFor={id}>
        {label}
      </label>
      <select
        {...rest}
        id={id}
        className="field__input field__select"
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(errorId, hintId) || undefined}
      >
        {children}
      </select>
      {error ? (
        <p className="field__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
