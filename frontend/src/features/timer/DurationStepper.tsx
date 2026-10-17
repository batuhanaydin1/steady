import { useId } from 'react'
import { IconButton } from '../../components/ui/index.ts'

interface DurationStepperProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  disabled?: boolean
}

function MinusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <path d="M3 7h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <path
        d="M7 3v8M3 7h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

/** Inline +/- control for a bounded number of minutes. */
export function DurationStepper({ label, value, min, max, onChange, disabled = false }: DurationStepperProps) {
  const inputId = useId()

  const setValue = (next: number) => {
    onChange(Math.min(Math.max(next, min), max))
  }

  return (
    <div className="stepper">
      <label className="stepper__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="stepper__controls">
        <IconButton
          size="sm"
          label={`${label}ni azalt`}
          disabled={disabled || value <= min}
          onClick={() => setValue(value - 1)}
        >
          <MinusIcon />
        </IconButton>
        <input
          id={inputId}
          className="stepper__input"
          type="number"
          min={min}
          max={max}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(event) => {
            const parsed = Number.parseInt(event.target.value, 10)
            if (!Number.isNaN(parsed)) setValue(parsed)
          }}
        />
        <span className="stepper__unit">dk</span>
        <IconButton
          size="sm"
          label={`${label}ni artır`}
          disabled={disabled || value >= max}
          onClick={() => setValue(value + 1)}
        >
          <PlusIcon />
        </IconButton>
      </div>
    </div>
  )
}
