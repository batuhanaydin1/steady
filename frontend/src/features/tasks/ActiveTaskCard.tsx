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
    title: 'Odaklandığın görev',
    subtitle: 'Odak süreni bir göreve bağla',
    actions: <Badge tone={activeTask ? 'accent' : 'neutral'}>{activeTask ? 'Bağlı' : 'Seçilmedi'}</Badge>,
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
          title="Görevlere ulaşılamıyor"
          description={loadError ?? 'Steady API yanıt vermedi.'}
          action={
            <Button variant="secondary" size="sm" onClick={reload}>
              Tekrar dene
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
          title="Bekleyen görev yok"
          description="Bir görev ekle, burada seçilebilir hale gelsin."
          action={
            <Button variant="secondary" size="sm" onClick={onOpenTasks}>
              Görev ekle
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
          Tüm görevleri gör
        </Button>
      }
    >
      <div className="active-task">
        <SelectField
          label="Görev"
          value={activeTaskId ?? ''}
          hint="Steady bu seçimi zamanlayıcınla birlikte saklar."
          onChange={(event) => setActiveTask(event.target.value === '' ? null : event.target.value)}
        >
          <option value="">Görev yok — sadece odaklan</option>
          {options.map((task) => (
            <option key={task.id} value={task.id}>
              {task.isCompleted ? `${task.title} (tamamlandı)` : task.title}
            </option>
          ))}
        </SelectField>

        {activeTask?.notes ? <p className="active-task__notes">{activeTask.notes}</p> : null}
      </div>
    </Card>
  )
}
