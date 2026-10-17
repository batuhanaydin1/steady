import { Badge, Button, Card, EmptyState, SelectField, Skeleton } from '../../components/ui/index.ts'
import { useTasks } from './tasksContext.ts'

interface ActiveTaskCardProps {
  onOpenTasks: () => void
}

/**
 * Links the focus timer to a task. The choice is stored with the timer, so it
 * is still selected after a reload or a trip to another screen.
 */
export function ActiveTaskCard({ onOpenTasks }: ActiveTaskCardProps) {
  const { tasks, state, loadError, activeTask, activeTaskId, setActiveTask, reload } = useTasks()

  const pending = tasks.filter((task) => !task.isCompleted)
  // A completed task stays selectable while it is the current focus target.
  const options = activeTask && activeTask.isCompleted ? [activeTask, ...pending] : pending

  const header = {
    title: 'Focusing on',
    subtitle: 'Link your focus time to a task',
    actions: <Badge tone={activeTask ? 'accent' : 'neutral'}>{activeTask ? 'Linked' : 'None'}</Badge>,
  }

  if (state === 'loading') {
    return (
      <Card {...header}>
        <div className="active-task">
          <Skeleton height="42px" />
          <Skeleton height="12px" width="55%" />
        </div>
      </Card>
    )
  }

  if (state === 'error') {
    return (
      <Card {...header}>
        <EmptyState
          title="Tasks are unavailable"
          description={loadError ?? 'The Steady API did not answer.'}
          action={
            <Button variant="secondary" size="sm" onClick={reload}>
              Try again
            </Button>
          }
        />
      </Card>
    )
  }

  if (options.length === 0) {
    return (
      <Card {...header}>
        <EmptyState
          title="No pending tasks"
          description="Add a task and it becomes selectable here."
          action={
            <Button variant="secondary" size="sm" onClick={onOpenTasks}>
              Add a task
            </Button>
          }
        />
      </Card>
    )
  }

  return (
    <Card
      {...header}
      footer={
        <Button variant="ghost" size="sm" onClick={onOpenTasks}>
          View all tasks
        </Button>
      }
    >
      <div className="active-task">
        <SelectField
          label="Task"
          value={activeTaskId ?? ''}
          hint="Steady keeps this selection with your timer."
          onChange={(event) => setActiveTask(event.target.value === '' ? null : event.target.value)}
        >
          <option value="">No task — just focus</option>
          {options.map((task) => (
            <option key={task.id} value={task.id}>
              {task.isCompleted ? `${task.title} (completed)` : task.title}
            </option>
          ))}
        </SelectField>

        {activeTask?.notes ? <p className="active-task__notes">{activeTask.notes}</p> : null}
      </div>
    </Card>
  )
}
