import { SegmentedControl } from '../../components/ui/index.ts'
import type { TaskFilter } from '../../types/api.ts'

const LABELS: Record<TaskFilter, string> = {
  all: 'All',
  pending: 'Pending',
  completed: 'Completed',
}

interface TaskFiltersProps {
  value: TaskFilter
  onChange: (value: TaskFilter) => void
  counts: Record<TaskFilter, number>
}

/** Filter switch with a live count for each option. */
export function TaskFilters({ value, onChange, counts }: TaskFiltersProps) {
  const options = (['all', 'pending', 'completed'] as const).map((filter) => ({
    value: filter,
    label: LABELS[filter],
    meta: counts[filter],
  }))

  return (
    <SegmentedControl<TaskFilter>
      label="Filter tasks"
      options={options}
      value={value}
      onChange={onChange}
      size="sm"
    />
  )
}
