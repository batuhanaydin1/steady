/** Shared API payload types. Keep in sync with the backend DTOs. */

/** `GET /api/health` */
export interface HealthResponse {
  status: 'ok' | 'degraded'
  service: string
  version: string
  /** Whether the API could actually reach PostgreSQL. */
  database: 'connected' | 'unavailable'
  timestampUtc: string
}

/** A task as returned by the API. */
export interface TaskResponse {
  id: string
  title: string
  notes: string | null
  isCompleted: boolean
  createdAt: string
  completedAt: string | null
}

/** Body of `POST /api/tasks`. */
export interface CreateTaskRequest {
  title: string
  notes: string | null
}

/** Body of `PUT /api/tasks/{id}`. */
export interface UpdateTaskRequest {
  title: string
  notes: string | null
  isCompleted: boolean
}

/** Which tasks a list request should return. */
export type TaskFilter = 'all' | 'pending' | 'completed'

/** A completed focus session as returned by the API. */
export interface FocusSessionResponse {
  id: string
  taskId: string | null
  /** The task title at the time of the session, kept even if the task is deleted. */
  taskTitle: string | null
  startedAt: string
  completedAt: string
  /** The focused time; shorter than the wall-clock span if the session was paused. */
  durationMinutes: number
}

/** Body of `POST /api/focus-sessions`. */
export interface CreateFocusSessionRequest {
  startedAt: string
  completedAt: string
  durationMinutes: number
  taskId: string | null
}

/** Timer preferences as returned by `GET /api/preferences/timer`. */
export interface TimerPreferencesResponse {
  workMinutes: number
  breakMinutes: number
  soundEnabled: boolean
  /** The user's intent. A given browser may still have to allow notifications. */
  notificationsEnabled: boolean
  /** When the saved preferences were last written, in UTC. */
  updatedAt: string
}

/** Body of `PUT /api/preferences/timer`. Replaces the whole document. */
export interface UpdateTimerPreferencesRequest {
  workMinutes: number
  breakMinutes: number
  soundEnabled: boolean
  notificationsEnabled: boolean
}
