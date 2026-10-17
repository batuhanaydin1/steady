import { apiDelete, apiGet, apiPost, apiPut } from './client.ts'
import type {
  CreateTaskRequest,
  TaskFilter,
  TaskResponse,
  UpdateTaskRequest,
} from '../types/api.ts'

/** `GET /api/tasks` — pending before completed, newest first. */
export function listTasks(
  filter: TaskFilter = 'all',
  signal?: AbortSignal,
): Promise<TaskResponse[]> {
  const query = filter === 'all' ? '' : `?status=${filter}`
  return apiGet<TaskResponse[]>(`/api/tasks${query}`, signal)
}

export function createTask(body: CreateTaskRequest, signal?: AbortSignal): Promise<TaskResponse> {
  return apiPost<TaskResponse>('/api/tasks', body, signal)
}

export function updateTask(
  id: string,
  body: UpdateTaskRequest,
  signal?: AbortSignal,
): Promise<TaskResponse> {
  return apiPut<TaskResponse>(`/api/tasks/${encodeURIComponent(id)}`, body, signal)
}

export function deleteTask(id: string, signal?: AbortSignal): Promise<void> {
  return apiDelete(`/api/tasks/${encodeURIComponent(id)}`, signal)
}
