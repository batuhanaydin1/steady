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
    label: 'Odak',
    title: 'Odak',
    description: 'Bir oturum başlat, seriyi sürdür.',
  },
  {
    id: 'tasks',
    label: 'Görevler',
    title: 'Görevler',
    description: 'Yapmak istediğin her şey.',
  },
  {
    id: 'stats',
    label: 'İstatistik',
    title: 'İstatistik',
    description: 'Odak sürenin zaman içindeki gelişimi.',
  },
  {
    id: 'settings',
    label: 'Ayarlar',
    title: 'Ayarlar',
    description: 'Zamanlayıcı varsayılanları, görünüm ve bağlantı.',
  },
]

export function isRouteId(value: unknown): value is RouteId {
  return ROUTES.some((route) => route.id === value)
}
