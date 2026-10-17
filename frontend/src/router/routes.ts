export interface RouteDefinition {
  id: RouteId
  label: string
  title: string
  description: string
}

export type RouteId = 'focus' | 'tasks' | 'stats' | 'settings'

export const DEFAULT_ROUTE: RouteId = 'focus'

export const ROUTES: readonly RouteDefinition[] = [
  {
    id: 'focus',
    label: 'Focus',
    title: 'Focus',
    description: 'Run a session and keep your streak alive.',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    title: 'Tasks',
    description: 'Everything you want to get done.',
  },
  {
    id: 'stats',
    label: 'Stats',
    title: 'Stats',
    description: 'Your focus time over time.',
  },
  {
    id: 'settings',
    label: 'Settings',
    title: 'Settings',
    description: 'Timer defaults, appearance and connection.',
  },
]

export function isRouteId(value: unknown): value is RouteId {
  return ROUTES.some((route) => route.id === value)
}
