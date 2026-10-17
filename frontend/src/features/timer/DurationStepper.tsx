import { useId, useState } from 'react'
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

/**
 * Inline +/- control for a bounded number of minutes.
 *
 * The field holds what is being typed as local text: clamping every keystroke
 * would turn "45" into the minimum as soon as the "4" landed.
 */
export function DurationStepper({ label, value, min, max, onChange, disabled = false }: DurationStepperProps) {
  const inputId = useId()
  const [draft, setDraft] = useState<string | null>(null)

  const setValue = (next: number) => {
    setDraft(null)
    onChange(Math.min(Math.max(next, min), max))
  }

  const commitDraft = (raw: string) => {
    const parsed = Number.parseInt(raw, 10)
    setDraft(null)
    if (!Number.isNaN(parsed)) setValue(parsed)
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
          inputMode="numeric"
          min={min}
          max={max}
          step={1}
          value={draft ?? value}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={(event) => commitDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commitDraft(event.currentTarget.value)
            else if (event.key === 'Escape') setDraft(null)
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
