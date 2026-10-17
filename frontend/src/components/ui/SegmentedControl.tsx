import { useId } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

export interface SegmentedOption<T extends string> {
  value: T
  label: ReactNode
  /** Optional trailing content such as a count. */
  meta?: ReactNode
  disabled?: boolean
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Accessible name for the group. */
  label: string
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Compact radio group used for filters, mode switches and the theme picker.
 * Implemented with real radio semantics so arrow keys work.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  const name = useId()

  return (
    <div className={cn('segmented', `segmented--${size}`, className)} role="radiogroup" aria-label={label}>
      {options.map((option) => {
        const checked = option.value === value
        return (
          <label
            key={option.value}
            className={cn(
              'segmented__item',
              checked && 'segmented__item--active',
              option.disabled && 'segmented__item--disabled',
            )}
          >
            <input
              className="sr-only"
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              disabled={option.disabled ?? false}
              onChange={() => onChange(option.value)}
            />
            <span className="segmented__label">{option.label}</span>
            {option.meta ? <span className="segmented__meta">{option.meta}</span> : null}
          </label>
        )
      })}
    </div>
  )
}
