import { useApiHealth } from '../../hooks/useApiHealth.ts'
import { cn } from '../../utils/cn.ts'

const LABELS = {
  checking: 'Steady API bağlantısı kontrol ediliyor',
  online: "Steady API'ye bağlı",
  offline: 'Steady API kullanılamıyor',
} as const

/** Compact connection indicator for the header. Full details live on Settings. */
export function ConnectionDot() {
  const { state, retry } = useApiHealth()

  // When the API is unreachable the dot becomes the retry control, so a
  // recovered backend does not need a full page reload.
  if (state.status === 'offline') {
    const label = `${LABELS.offline} — tekrar denemek için tıkla`

    return (
      <button
        type="button"
        className={cn('connection-dot', 'connection-dot--offline', 'connection-dot--button')}
        aria-label={label}
        title={label}
        onClick={retry}
      />
    )
  }

  return (
    <span
      className={cn('connection-dot', `connection-dot--${state.status}`)}
      role="status"
      aria-label={LABELS[state.status]}
      title={LABELS[state.status]}
    />
  )
}
