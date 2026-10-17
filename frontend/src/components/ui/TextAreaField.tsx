import { useId } from 'react'
import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn.ts'

export interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string
  hint?: ReactNode
  error?: string | null
  /** Visually hides the label while keeping it for screen readers. */
  hideLabel?: boolean
}

/** Multi-line sibling of `TextField`, with the same hint and error support. */
export function TextAreaField({
  label,
  hint,
  error,
  hideLabel = false,
  className,
  ...rest
}: TextAreaFieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={cn('field', error && 'field--invalid', className)}>
      <label className={cn('field__label', hideLabel && 'sr-only')} htmlFor={id}>
        {label}
      </label>
      <textarea
        {...rest}
        id={id}
        className="field__input field__textarea"
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(errorId, hintId) || undefined}
      />
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
