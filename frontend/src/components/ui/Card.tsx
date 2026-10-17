import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

interface CardProps {
  title?: ReactNode
  subtitle?: ReactNode
  /** Controls rendered on the right side of the header. */
  actions?: ReactNode
  footer?: ReactNode
  className?: string
  /** Removes the inner padding — useful for lists and tables. */
  flush?: boolean
  children: ReactNode
}

/** Surface container used for every block on a page. */
export function Card({ title, subtitle, actions, footer, className, flush = false, children }: CardProps) {
  const hasHeader = Boolean(title || subtitle || actions)

  return (
    <section className={cn('card', flush && 'card--flush', className)}>
      {hasHeader && (
        <header className="card__header">
          <div className="card__heading">
            {title ? <h2 className="card__title">{title}</h2> : null}
            {subtitle ? <p className="card__subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="card__actions">{actions}</div> : null}
        </header>
      )}
      <div className="card__body">{children}</div>
      {footer ? <footer className="card__footer">{footer}</footer> : null}
    </section>
  )
}
