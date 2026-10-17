import type { ReactNode } from 'react'
import { ROUTES } from '../../router/routes.ts'
import type { RouteDefinition } from '../../router/routes.ts'
import { TimerStatusPill } from '../../features/timer/TimerStatusPill.tsx'
import { SteadyMark } from '../SteadyMark.tsx'
import { AboutDialog } from './AboutDialog.tsx'
import { ConnectionDot } from './ConnectionDot.tsx'
import { ThemeToggle } from './ThemeToggle.tsx'
import { cn } from '../../utils/cn.ts'

interface AppShellProps {
  current: RouteDefinition
  children: ReactNode
}

/**
 * Application chrome: brand, primary navigation, theme switch, page heading
 * and footer. Pages only render their own content.
 */
export function AppShell({ current, children }: AppShellProps) {
  return (
    <div className="shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="shell__header">
        <div className="shell__bar">
          <a className="brand" href="#/focus" aria-label="Steady — go to Focus">
            <SteadyMark size={26} />
            <span className="brand__name">Steady</span>
          </a>

          <nav className="nav" aria-label="Main">
            {ROUTES.map((route) => {
              const active = route.id === current.id
              return (
                <a
                  key={route.id}
                  className={cn('nav__link', active && 'nav__link--active')}
                  href={`#/${route.id}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {route.label}
                </a>
              )
            })}
          </nav>

          <div className="shell__tools">
            <TimerStatusPill />
            <ThemeToggle />
            <ConnectionDot />
          </div>
        </div>
      </header>

      <main className="shell__main" id="main-content" tabIndex={-1}>
        <div className="page-head">
          <h1 className="page-head__title">{current.title}</h1>
          <p className="page-head__description">{current.description}</p>
        </div>
        {children}
      </main>

      <footer className="shell__footer">
        <span className="shell__footer-brand">Steady</span>
        <span className="shell__footer-slogan">Build consistency. One session at a time.</span>
        <AboutDialog />
      </footer>
    </div>
  )
}
