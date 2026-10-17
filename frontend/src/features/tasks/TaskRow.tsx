import { Button } from '../../components/ui/index.ts'
import type { TaskResponse } from '../../types/api.ts'
import { cn } from '../../utils/cn.ts'
import { formatTaskDate } from './tasks.ts'

interface TaskRowProps {
  task: TaskResponse
  /** True when focus sessions are linked to this task. */
  isActive: boolean
  /** True while a request for this task is in flight. */
  pending: boolean
  onToggle: (task: TaskResponse) => void
  onEdit: (task: TaskResponse) => void
  onDelete: (task: TaskResponse) => void
  onFocus: (task: TaskResponse) => void
}

export function TaskRow({
  task,
  isActive,
  pending,
  onToggle,
  onEdit,
  onDelete,
  onFocus,
}: TaskRowProps) {
  const stamp = formatTaskDate(task.isCompleted ? task.completedAt : task.createdAt)
  const meta = task.isCompleted ? `Completed ${stamp}` : `Added ${stamp}`

  return (
    <li
      className={cn(
        'task',
        task.isCompleted && 'task--done',
        isActive && 'task--active',
        pending && 'task--pending',
      )}
    >
      <label className="task__check">
        <input
          type="checkbox"
          className="task__checkbox sr-only"
          checked={task.isCompleted}
          disabled={pending}
          onChange={() => onToggle(task)}
        />
        <span className="task__box" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" focusable="false">
            <path
              d="M2.5 6.3 4.9 8.6 9.5 3.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="sr-only">
          {task.isCompleted ? 'Reopen' : 'Complete'} {task.title}
        </span>
      </label>

      <div className="task__body">
        <p className="task__title">{task.title}</p>
        {task.notes ? <p className="task__notes">{task.notes}</p> : null}
        <p className="task__meta">
          <span>{meta}</span>
          {isActive ? <span className="task__flag">Focus target</span> : null}
        </p>
      </div>

      <div className="task__actions">
        <Button
          size="sm"
          variant="ghost"
          aria-label={`Focus on ${task.title}`}
          onClick={() => onFocus(task)}
        >
          Focus
        </Button>
        <Button size="sm" variant="ghost" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          aria-label={`Delete ${task.title}`}
          onClick={() => onDelete(task)}
        >
          Delete
        </Button>
      </div>
    </li>
  )
}
