import { Skeleton } from '../../components/ui/index.ts'

interface StatTileProps {
  /** The headline figure, already formatted. */
  value: string
  /** The supporting line underneath it. */
  hint: string
}

/** A headline figure with a supporting line — the body of a summary card. */
export function StatTile({ value, hint }: StatTileProps) {
  return (
    <div className="stat">
      <p className="stat__value">{value}</p>
      <p className="stat__hint">{hint}</p>
    </div>
  )
}

/** Loading shape that matches a tile, so nothing shifts when the data lands. */
export function StatTileSkeleton() {
  return (
    <div className="stat" aria-busy="true">
      <Skeleton height="30px" width="62%" />
      <Skeleton height="13px" width="46%" />
    </div>
  )
}
