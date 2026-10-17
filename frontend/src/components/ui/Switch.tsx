import { useId } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  hint?: ReactNode
  disabled?: boolean
  className?: string
}

/** Accessible on/off control built on a real checkbox. */
export function Switch({ checked, onChange, label, hint, disabled = false, className }: SwitchProps) {
  const id = useId()

  return (
    <div className={cn('switch-row', className)}>
      <div className="switch-row__text">
        <label className="switch-row__label" htmlFor={id}>
          {label}
        </label>
        {hint ? <p className="switch-row__hint">{hint}</p> : null}
      </div>
      <label className="switch" htmlFor={id}>
        <input
          id={id}
          className="sr-only"
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="switch__track" aria-hidden="true">
          <span className="switch__thumb" />
        </span>
      </label>
    </div>
  )
}
