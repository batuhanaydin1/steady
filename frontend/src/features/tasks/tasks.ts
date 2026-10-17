/**
 * Pure task helpers: filtering, sorting, counting and validation.
 *
 * The limits and messages mirror the server-side rules in
 * `backend/Steady.Api/Dtos/*Request.cs` so the form can fail fast without a
 * round trip — the API remains the source of truth.
 */

import type { TaskFilter, TaskResponse } from '../../types/api.ts'

export const TITLE_MAX_LENGTH = 200
export const NOTES_MAX_LENGTH = 2000

/** Pending first, newest first — the same order the API returns. */
export function sortTasks(tasks: readonly TaskResponse[]): TaskResponse[] {
  return [...tasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1
    return Date.parse(b.createdAt) - Date.parse(a.createdAt)
  })
}

export function filterTasks(tasks: readonly TaskResponse[], filter: TaskFilter): TaskResponse[] {
  if (filter === 'pending') return tasks.filter((task) => !task.isCompleted)
  if (filter === 'completed') return tasks.filter((task) => task.isCompleted)
  return [...tasks]
}

export function countByFilter(tasks: readonly TaskResponse[]): Record<TaskFilter, number> {
  const completed = tasks.filter((task) => task.isCompleted).length
  return { all: tasks.length, pending: tasks.length - completed, completed }
}

export function validateTitle(title: string): string | null {
  const trimmed = title.trim()
  if (trimmed.length === 0) return 'A title is required.'
  if (trimmed.length > TITLE_MAX_LENGTH) {
    return `The title must be ${TITLE_MAX_LENGTH} characters or fewer.`
  }
  return null
}

export function validateNotes(notes: string): string | null {
  if (notes.trim().length > NOTES_MAX_LENGTH) {
    return `Notes must be ${NOTES_MAX_LENGTH} characters or fewer.`
  }
  return null
}

/** Empty notes are sent as `null` so the database stays clean. */
export function normalizeNotes(notes: string): string | null {
  const trimmed = notes.trim()
  return trimmed.length === 0 ? null : trimmed
}

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })

export function formatTaskDate(iso: string | null): string {
  if (!iso) return ''
  const timestamp = Date.parse(iso)
  if (Number.isNaN(timestamp)) return ''
  return DATE_FORMAT.format(timestamp)
}
