import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiError } from '../../api/client.ts'
import { createTask, deleteTask, listTasks, updateTask } from '../../api/tasks.ts'
import type { TaskResponse } from '../../types/api.ts'
import { readJson, writeJson } from '../../utils/storage.ts'
import { sortTasks } from './tasks.ts'
import { TasksContext } from './tasksContext.ts'
import type { TaskDraft, TasksContextValue } from './tasksContext.ts'

const ACTIVE_TASK_KEY = 'steady.tasks.activeTaskId'

function messageFor(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback
}

/**
 * Owns the task list for the whole app so the Tasks screen and the focus-time
 * task picker always show the same data.
 *
 * Mutations are optimistic: the list updates immediately and rolls back if the
 * API rejects the change. Create and update reject so the form can show the
 * reason next to its fields; completing and deleting report through
 * `actionError`, because they are triggered straight from the list.
 */
export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskResponse[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(() =>
    readJson<string | null>(ACTIVE_TASK_KEY, null),
  )
  const [attempt, setAttempt] = useState(0)

  // Latest committed list, readable from async callbacks without stale closures.
  const tasksRef = useRef<TaskResponse[]>(tasks)
  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  /* ---- Initial load (and manual retry) ---- */

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    listTasks('all', controller.signal)
      .then((data) => {
        if (!active) return
        setTasks(sortTasks(data))
        setState('ready')
        setLoadError(null)
      })
      .catch((error: unknown) => {
        if (!active) return
        if (error instanceof DOMException && error.name === 'AbortError') return
        setState('error')
        setLoadError(messageFor(error, 'Could not load your tasks.'))
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [attempt])

  useEffect(() => {
    writeJson(ACTIVE_TASK_KEY, activeTaskId)
  }, [activeTaskId])

  const reload = useCallback(() => {
    setState('loading')
    setLoadError(null)
    setAttempt((value) => value + 1)
  }, [])

  const dismissActionError = useCallback(() => setActionError(null), [])

  /* ---- Mutations ---- */

  const create = useCallback(async (draft: TaskDraft) => {
    setSaving(true)
    try {
      const created = await createTask({ title: draft.title.trim(), notes: draft.notes })
      setTasks((current) => sortTasks([...current, created]))
    } finally {
      setSaving(false)
    }
  }, [])

  const update = useCallback(
    async (id: string, draft: TaskDraft & { isCompleted: boolean }) => {
      const previous = tasksRef.current.find((task) => task.id === id)
      if (!previous) throw new Error('That task no longer exists.')

      const now = new Date().toISOString()
      const optimistic: TaskResponse = {
        ...previous,
        title: draft.title.trim(),
        notes: draft.notes,
        isCompleted: draft.isCompleted,
        completedAt: draft.isCompleted ? (previous.completedAt ?? now) : null,
      }

      setPendingId(id)
      setTasks((current) => sortTasks(current.map((task) => (task.id === id ? optimistic : task))))

      try {
        const saved = await updateTask(id, {
          title: draft.title.trim(),
          notes: draft.notes,
          isCompleted: draft.isCompleted,
        })
        setTasks((current) => sortTasks(current.map((task) => (task.id === id ? saved : task))))
      } catch (error) {
        setTasks((current) => sortTasks(current.map((task) => (task.id === id ? previous : task))))
        throw error
      } finally {
        setPendingId(null)
      }
    },
    [],
  )

  const runToggle = useCallback(async (task: TaskResponse) => {
    const next = !task.isCompleted
    setActionError(null)
    setPendingId(task.id)
    setTasks((current) =>
      sortTasks(
        current.map((item) =>
          item.id === task.id
            ? {
                ...item,
                isCompleted: next,
                completedAt: next ? new Date().toISOString() : null,
              }
            : item,
        ),
      ),
    )

    try {
      const saved = await updateTask(task.id, {
        title: task.title,
        notes: task.notes,
        isCompleted: next,
      })
      setTasks((current) => sortTasks(current.map((item) => (item.id === task.id ? saved : item))))
    } catch (error) {
      setTasks((current) => sortTasks(current.map((item) => (item.id === task.id ? task : item))))
      setActionError(messageFor(error, 'Could not update that task.'))
    } finally {
      setPendingId(null)
    }
  }, [])

  const toggleCompleted = useCallback(
    (task: TaskResponse) => {
      void runToggle(task)
    },
    [runToggle],
  )

  const setActiveTask = useCallback((id: string | null) => {
    setActiveTaskId(id)
  }, [])

  const runRemove = useCallback(
    async (id: string) => {
      const previous = tasksRef.current.find((task) => task.id === id)
      if (!previous) return

      setActionError(null)
      setPendingId(id)
      setTasks((current) => current.filter((task) => task.id !== id))
      if (activeTaskId === id) setActiveTask(null)

      try {
        await deleteTask(id)
      } catch (error) {
        setTasks((current) => sortTasks([...current, previous]))
        setActionError(messageFor(error, 'Could not delete that task.'))
      } finally {
        setPendingId(null)
      }
    },
    [activeTaskId, setActiveTask],
  )

  const remove = useCallback(
    (id: string) => {
      void runRemove(id)
    },
    [runRemove],
  )

  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeTaskId) ?? null,
    [tasks, activeTaskId],
  )

  const value = useMemo<TasksContextValue>(
    () => ({
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
      activeTask,
      setActiveTask,
    }),
    [
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
      activeTask,
      setActiveTask,
    ],
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}
