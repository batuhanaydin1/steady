import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_ROUTE, isRouteId, ROUTES } from './routes.ts'
import type { RouteId } from './routes.ts'

function readRouteFromHash(): RouteId {
  const raw = window.location.hash.replace(/^#\/?/, '')
  return isRouteId(raw) ? raw : DEFAULT_ROUTE
}

/**
 * A deliberately tiny hash router: no dependency, but the URL updates so
 * deep links, refresh and the browser back/forward buttons all behave.
 */
export function useHashRoute() {
  const [route, setRoute] = useState<RouteId>(() => readRouteFromHash())

  useEffect(() => {
    const onHashChange = () => setRoute(readRouteFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // A route change should start at the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [route])

  const navigate = useCallback((next: RouteId) => {
    if (readRouteFromHash() === next) return
    window.location.hash = `#/${next}`
  }, [])

  const current = ROUTES.find((item) => item.id === route) ?? ROUTES[0]

  return { route, current, navigate }
}
