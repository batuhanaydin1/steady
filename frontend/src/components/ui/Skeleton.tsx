import { cn } from '../../utils/cn.ts'

interface SkeletonProps {
  width?: string
  height?: string
  /** Renders a circle — handy for avatars and rings. */
  circle?: boolean
  className?: string
}

/** Loading placeholder that mirrors the shape of the content it replaces. */
export function Skeleton({ width = '100%', height = '1rem', circle = false, className }: SkeletonProps) {
  return (
    <span
      className={cn('skeleton', circle && 'skeleton--circle', className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}
