import { apiGet } from './client.ts'
import type { HealthResponse } from '../types/api.ts'

/** Confirms the API is reachable. */
export function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return apiGet<HealthResponse>('/api/health', signal)
}
