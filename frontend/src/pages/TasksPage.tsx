import { useState } from 'react'
import { Badge, Button, Card, Modal, Notice } from '../components/ui/index.ts'
import { TaskComposer } from '../features/tasks/TaskComposer.tsx'
import { TaskEditDialog } from '../features/tasks/TaskEditDialog.tsx'
import { TaskFilters } from '../features/tasks/TaskFilters.tsx'
import { TaskList } from '../features/tasks/TaskList.tsx'
import { countByFilter, filterTasks } from '../features/tasks/tasks.ts'
import { useTasks } from '../features/tasks/tasksContext.ts'
import type { TaskFilter, TaskResponse } from '../types/api.ts'

interface TasksPageProps {
  onStartFocus: () => void
}

/** Task list: create, edit, complete, delete and filter — all against the API. */
export function TasksPage({ onStartFocus }: TasksPageProps) {
  const {
    tasks,
    state,
    loadError,
    actionError,
    dismissActionError,
    saving,
    pendingId,
    reload,
    create,
    update,
    toggleCompleted,
    remove,
    activeTaskId,
    setActiveTask,
  } = useTasks()

  const [filter, setFilter] = useState<TaskFilter>('all')
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<TaskResponse | null>(null)

  const counts = countByFilter(tasks)
  const visible = filterTasks(tasks, filter)

  /** Links the task to the timer and takes the user to it. */
  const focusTask = (task: TaskResponse) => {
    setActiveTask(task.id)
    onStartFocus()
  }

  const confirmDelete = () => {
    if (!taskToDelete) return
    remove(taskToDelete.id)
    setTaskToDelete(null)
  }

  return (
    <div className="tasks">
      <Card
        title="Görevler"
        subtitle="Oluştur, tamamla ve filtrele"
        actions={
          <Badge tone={counts.pending > 0 ? 'accent' : 'neutral'}>{counts.pending} bekleyen</Badge>
        }
      >
        <TaskComposer onCreate={create} saving={saving} />

        <div className="tasks__toolbar">
          <TaskFilters value={filter} onChange={setFilter} counts={counts} />
          {state === 'ready' ? (
            <Button variant="ghost" size="sm" onClick={reload} disabled={state !== 'ready'}>
              Yenile
            </Button>
          ) : null}
        </div>

        {actionError ? (
          <Notice
            tone="danger"
            role="alert"
            action={
              <button type="button" className="notice__action" onClick={dismissActionError}>
                Kapat
              </button>
            }
          >
            {actionError}
          </Notice>
        ) : null}

        <TaskList
          state={state}
          loadError={loadError}
          tasks={visible}
          filter={filter}
          hiddenByFilter={tasks.length > 0 && visible.length === 0}
          activeTaskId={activeTaskId}
          pendingId={pendingId}
          onRetry={reload}
          onShowAll={() => setFilter('all')}
          onToggle={toggleCompleted}
          onEdit={setEditingTask}
          onDelete={setTaskToDelete}
          onFocus={focusTask}
        />
      </Card>

      {editingTask ? (
        <TaskEditDialog
          key={editingTask.id}
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={(draft) =>
            update(editingTask.id, {
              title: draft.title,
              notes: draft.notes,
              isCompleted:
                tasks.find((task) => task.id === editingTask.id)?.isCompleted ??
                editingTask.isCompleted,
            })
          }
        />
      ) : null}

      <Modal
        open={taskToDelete !== null}
        size="sm"
        title="Bu görev silinsin mi?"
        description={
          taskToDelete ? `“${taskToDelete.title}” kalıcı olarak silinecek.` : undefined
        }
        onClose={() => setTaskToDelete(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTaskToDelete(null)}>
              Vazgeç
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={taskToDelete !== null && pendingId === taskToDelete.id}
            >
              Sil
            </Button>
          </>
        }
      >
        <p className="tasks__confirm-note">
          Tamamlanan çalışmalar etkilenmez — yalnızca bu görev silinir.
        </p>
      </Modal>
    </div>
  )
}
