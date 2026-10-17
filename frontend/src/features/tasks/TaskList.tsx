import { Button, EmptyState, Skeleton } from '../../components/ui/index.ts'
import type { TaskFilter, TaskResponse } from '../../types/api.ts'
import { TaskRow } from './TaskRow.tsx'

const FILTER_NOUN: Record<TaskFilter, string> = {
  all: 'tasks',
  pending: 'pending tasks',
  completed: 'completed tasks',
}

interface TaskListProps {
  state: 'loading' | 'ready' | 'error'
  loadError: string | null
  tasks: TaskResponse[]
  filter: TaskFilter
  /** True when the user has tasks, but the current filter hides them all. */
  hiddenByFilter: boolean
  activeTaskId: string | null
  pendingId: string | null
  onRetry: () => void
  onShowAll: () => void
  onToggle: (task: TaskResponse) => void
  onEdit: (task: TaskResponse) => void
  onDelete: (task: TaskResponse) => void
  onFocus: (task: TaskResponse) => void
}

/** Renders the visible tasks, plus the loading, error and empty states. */
export function TaskList({
  state,
  loadError,
  tasks,
  filter,
  hiddenByFilter,
  activeTaskId,
  pendingId,
  onRetry,
  onShowAll,
  onToggle,
  onEdit,
  onDelete,
  onFocus,
}: TaskListProps) {
  if (state === 'loading') {
    return (
      <ul className="task-list" aria-busy="true" aria-label="Loading tasks">
        {[0, 1, 2].map((index) => (
          <li className="task task--skeleton" key={index}>
            <Skeleton circle height="22px" width="22px" />
            <div className="task__body">
              <Skeleton height="14px" width={index === 1 ? '42%' : '62%'} />
              <Skeleton height="11px" width="28%" />
            </div>
          </li>
        ))}
      </ul>
    )
  }

  if (state === 'error') {
    return (
      <EmptyState
        title="Could not load your tasks"
        description={loadError ?? 'The Steady API did not answer.'}
        action={
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        }
      />
    )
  }

  if (tasks.length === 0) {
    if (hiddenByFilter) {
      return (
        <EmptyState
          title={`No ${FILTER_NOUN[filter]}`}
          description="Nothing matches this filter right now."
          action={
            <Button variant="secondary" size="sm" onClick={onShowAll}>
              Show all tasks
            </Button>
          }
        />
      )
    }

    return (
      <EmptyState
        title="No tasks yet"
        description="Add your first task above, then link a focus session to it."
      />
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          isActive={task.id === activeTaskId}
          pending={task.id === pendingId}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onFocus={onFocus}
        />
      ))}
    </ul>
  )
}
