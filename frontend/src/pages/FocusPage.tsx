import { Card } from '../components/ui/index.ts'
import { SessionHistoryCard } from '../features/sessions/SessionHistoryCard.tsx'
import { TodayStats } from '../features/sessions/TodayStats.tsx'
import { ActiveTaskCard } from '../features/tasks/ActiveTaskCard.tsx'
import { TimerPanel } from '../features/timer/TimerPanel.tsx'
import { TimerSettings } from '../features/timer/TimerSettings.tsx'

interface FocusPageProps {
  onOpenTasks: () => void
  onOpenStats: () => void
}

/**
 * Home screen: the working focus timer takes the main column, with the task it
 * is linked to, its settings, today's totals and the recent session history
 * alongside.
 */
export function FocusPage({ onOpenTasks, onOpenStats }: FocusPageProps) {
  return (
    <div className="grid grid--focus">
      <TimerPanel />

      <div className="grid__side">
        <ActiveTaskCard onOpenTasks={onOpenTasks} />

        <TimerSettings />

        <Card title="Today" subtitle="Focus time and sessions">
          <TodayStats />
        </Card>

        <SessionHistoryCard onOpenStats={onOpenStats} />
      </div>
    </div>
  )
}
