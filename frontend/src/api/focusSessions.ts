import { apiGet, apiPost } from './client.ts'
import type { CreateFocusSessionRequest, FocusSessionResponse } from '../types/api.ts'

/** `GET /api/focus-sessions` — newest first. The API caps `limit` at 100. */
export function listFocusSessions(
  limit = 50,
  signal?: AbortSignal,
): Promise<FocusSessionResponse[]> {
  return apiGet<FocusSessionResponse[]>(`/api/focus-sessions?limit=${limit}`, signal)
}

export function createFocusSession(
  body: CreateFocusSessionRequest,
  signal?: AbortSignal,
): Promise<FocusSessionResponse> {
  return apiPost<FocusSessionResponse>('/api/focus-sessions', body, signal)
}
