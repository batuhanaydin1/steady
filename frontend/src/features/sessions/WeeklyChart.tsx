import { Skeleton } from '../../components/ui/index.ts'
import { formatMinutes, formatSessionCount } from './sessions.ts'
import type { ChartDay } from './stats.ts'

interface WeeklyChartProps {
  days: readonly ChartDay[]
  /** Shows bar-shaped skeletons instead of the chart. */
  loading?: boolean
}

/**
 * Focus time per day for the last seven days.
 *
 * Drawn with plain CSS rather than a charting dependency, and built so it does
 * not depend on colour: each bar carries its figure as text, and each day is
 * spelled out for screen readers.
 */
export function WeeklyChart({ days, loading = false }: WeeklyChartProps) {
  if (loading) {
    return (
      <div className="chart" aria-busy="true" aria-label="Loading focus time per day">
        <ul className="chart__days">
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <li className="chart__day" key={index}>
              <Skeleton height="13px" width="52%" />
              <span className="chart__column">
                <Skeleton height={`${40 + (index % 4) * 22}px`} width="100%" />
              </span>
              <Skeleton height="12px" width="70%" />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const total = days.reduce((sum, day) => sum + day.minutes, 0)
  const peak = days.reduce((max, day) => Math.max(max, day.minutes), 0)

  return (
    <figure className="chart">
      <figcaption className="chart__caption">
        {total === 0
          ? 'No focus time in the last seven days.'
          : `${formatMinutes(total)} focused in the last seven days.`}
      </figcaption>

      <ul className="chart__days">
        {days.map((day) => {
          // A recorded day always shows a sliver, so a short session never looks
          // the same as a day with no sessions at all.
          const height = peak === 0 || day.minutes === 0 ? 0 : Math.max((day.minutes / peak) * 100, 6)
          const empty = day.minutes === 0

          return (
            <li className={day.isToday ? 'chart__day chart__day--today' : 'chart__day'} key={day.key}>
              <span className="chart__value" aria-hidden="true">
                {empty ? '–' : day.minutes}
              </span>

              <span className="chart__column" aria-hidden="true">
                <span className="chart__bar" style={{ height: `${height}%` }} />
              </span>

              <span className="chart__label" aria-hidden="true">
                {day.weekday}
                <span className="chart__date">{day.dayOfMonth}</span>
              </span>

              <span className="sr-only">
                {day.label}: {empty ? 'no focus time' : formatMinutes(day.minutes)},{' '}
                {formatSessionCount(day.sessions)}.
              </span>
            </li>
          )
        })}
      </ul>
    </figure>
  )
}
