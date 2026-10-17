/**
 * Minimal typed wrapper around fetch for the Steady API.
 *
 * - Base URL comes from `VITE_API_BASE_URL`, falling back to the local API.
 * - Non-2xx responses become `ApiError` so callers can render useful messages.
 */

const DEFAULT_BASE_URL = 'http://localhost:5080'

function resolveBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL
  if (typeof configured === 'string' && configured.trim().length > 0) {
    return configured.trim().replace(/\/+$/, '')
  }
  return DEFAULT_BASE_URL
}

export const API_BASE_URL = resolveBaseUrl()

export class ApiError extends Error {
  readonly status: number
  readonly details: unknown

  constructor(message: string, status: number, details: unknown = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }

  /** True when the request never reached the server. */
  get isNetworkError(): boolean {
    return this.status === 0
  }
}

async function readJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) return null
  try {
    return await response.json()
  } catch {
    return null
  }
}

function extractMessage(payload: unknown): string | null {
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    for (const key of ['message', 'title', 'detail', 'error']) {
      const value = record[key]
      if (typeof value === 'string' && value.length > 0) return value
    }
  }
  return null
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response
  try {
    response = await fetch(url, { ...init, headers })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError('Could not reach the Steady API.', 0, error)
  }

  if (!response.ok) {
    const details = await readJson(response)
    const message =
      extractMessage(details) ?? `The server responded with status ${response.status}.`
    throw new ApiError(message, response.status, details)
  }

  if (response.status === 204) return undefined as T
  return (await readJson(response)) as T
}

export function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  return apiRequest<T>(path, { method: 'GET', signal })
}

export function apiPost<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  return apiRequest<T>(path, { method: 'POST', body: JSON.stringify(body), signal })
}

export function apiPut<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  return apiRequest<T>(path, { method: 'PUT', body: JSON.stringify(body), signal })
}

export function apiDelete(path: string, signal?: AbortSignal): Promise<void> {
  return apiRequest<void>(path, { method: 'DELETE', signal })
}
