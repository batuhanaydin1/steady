import { apiGet, apiPut } from './client.ts'
import type { TimerPreferencesResponse, UpdateTimerPreferencesRequest } from '../types/api.ts'

/**
 * `GET /api/preferences/timer` — the saved timer settings.
 *
 * Steady has no accounts, so this is one document for the whole installation,
 * not a collection: there is nothing to create, list or delete.
 */
export function getTimerPreferences(signal?: AbortSignal): Promise<TimerPreferencesResponse> {
  return apiGet<TimerPreferencesResponse>('/api/preferences/timer', signal)
}

/** `PUT /api/preferences/timer` — replaces the saved timer settings. */
export function updateTimerPreferences(
  body: UpdateTimerPreferencesRequest,
  signal?: AbortSignal,
): Promise<TimerPreferencesResponse> {
  return apiPut<TimerPreferencesResponse>('/api/preferences/timer', body, signal)
}
