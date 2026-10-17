import { createContext, useContext } from 'react'
import type { TaskResponse } from '../../types/api.ts'

/** Title and notes as edited in the UI, before validation or trimming. */
export interface TaskDraft {
  title: string
  notes: string | null
}

export interface TasksContextValue {
  tasks: TaskResponse[]
  /** State of the initial list load. */
  state: 'loading' | 'ready' | 'error'
  loadError: string | null
  /** Error from the most recent list action (completing or deleting). */
  actionError: string | null
  dismissActionError: () => void
  /** True while a create request is in flight. */
  saving: boolean
  /** Id of the task a request is currently in flight for. */
  pendingId: string | null
  reload: () => void
  /** Resolves when the task is saved; rejects with the reason when it is not. */
  create: (draft: TaskDraft) => Promise<void>
  update: (id: string, draft: TaskDraft & { isCompleted: boolean }) => Promise<void>
  toggleCompleted: (task: TaskResponse) => void
  remove: (id: string) => void
  /** The task the next focus session is linked to. */
  activeTaskId: string | null
  activeTask: TaskResponse | null
  setActiveTask: (id: string | null) => void
}

export const TasksContext = createContext<TasksContextValue | null>(null)

export function useTasks(): TasksContextValue {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error('useTasks must be used inside <TasksProvider>.')
  }
  return context
}
