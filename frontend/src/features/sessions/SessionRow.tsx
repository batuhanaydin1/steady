import type { FocusSessionResponse } from '../../types/api.ts'
import { formatMinutes, formatTime } from './sessions.ts'

/** One recorded session: when it finished, what it was for, how long it ran. */
export function SessionRow({ session }: { session: FocusSessionResponse }) {
  return (
    <li className="session">
      <span className="session__time">{formatTime(session.completedAt)}</span>
      <span className="session__task">{session.taskTitle ?? 'Görev yok'}</span>
      <span className="session__duration">{formatMinutes(session.durationMinutes)}</span>
    </li>
  )
}
