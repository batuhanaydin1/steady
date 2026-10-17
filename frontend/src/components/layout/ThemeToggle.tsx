import { useTheme } from '../../theme/theme.ts'
import type { Theme } from '../../theme/theme.ts'
import { SegmentedControl } from '../ui/index.ts'
import type { SegmentedOption } from '../ui/index.ts'

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="3.2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M8 1.4v1.6M8 13v1.6M1.4 8h1.6M13 8h1.6M3.3 3.3l1.1 1.1M11.6 11.6l1.1 1.1M12.7 3.3l-1.1 1.1M4.4 11.6l-1.1 1.1" />
      </g>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8z"
        fill="currentColor"
      />
    </svg>
  )
}

const THEME_OPTIONS: readonly SegmentedOption<Theme>[] = [
  {
    value: 'light',
    label: (
      <>
        <SunIcon /> Açık
      </>
    ),
  },
  {
    value: 'dark',
    label: (
      <>
        <MoonIcon /> Koyu
      </>
    ),
  },
]

/** Light/dark switch, shared by the header and the settings page. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <SegmentedControl<Theme>
      className={className}
      label="Renk teması"
      size="sm"
      options={THEME_OPTIONS}
      value={theme}
      onChange={setTheme}
    />
  )
}
