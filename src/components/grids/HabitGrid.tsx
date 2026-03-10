import { useQuery } from 'convex/react'

import { api } from '~/../convex/_generated/api'
import type { Id } from '~/../convex/_generated/dataModel'

import { GridCell } from './GridCell'

export interface CellData {
  dateStr: string
  value: number
  target: number
}

export interface HabitGridProps {
  name: string
  icon?: { type: 'emoji' | 'icon'; value: string }
  color: string
  cells: CellData[]
  habitId?: Id<'habits'>
  stats?: { currentStreak: number; completionRate: number } | null
  weekStart?: 'monday' | 'sunday'
  isAllHabits?: boolean
}

export function HabitGrid({
  name,
  icon,
  color,
  cells,
  habitId,
  stats: providedStats,
  weekStart = 'monday',
  isAllHabits = false,
}: HabitGridProps) {
  const fetchedStats = useQuery(
    api.stats.forHabit,
    habitId ? { habitId } : 'skip',
  )

  const stats = providedStats ?? fetchedStats
  const daysOfWeek =
    weekStart === 'monday'
      ? [
          { key: 'mon', label: 'M' },
          { key: 'tue', label: 'T' },
          { key: 'wed', label: 'W' },
          { key: 'thu', label: 'T' },
          { key: 'fri', label: 'F' },
          { key: 'sat', label: 'S' },
          { key: 'sun', label: 'S' },
        ]
      : [
          { key: 'sun', label: 'S' },
          { key: 'mon', label: 'M' },
          { key: 'tue', label: 'T' },
          { key: 'wed', label: 'W' },
          { key: 'thu', label: 'T' },
          { key: 'fri', label: 'F' },
          { key: 'sat', label: 'S' },
        ]

  const renderedIcon = icon ? (
    icon.type === 'emoji' ? (
      icon.value
    ) : (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="inline-block"
        aria-hidden="true"
      >
        <title>Habit icon</title>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  ) : null

  const gridColumnsClass = isAllHabits
    ? 'grid-cols-[auto_repeat(14,minmax(0,1fr))] min-[900px]:grid-cols-[auto_repeat(28,minmax(0,1fr))] min-[1400px]:grid-cols-[auto_repeat(42,minmax(0,1fr))]'
    : 'grid-cols-[auto_repeat(14,minmax(0,1fr))]'

  return (
    <div
      className={`@container flex flex-col gap-4 overflow-hidden ${isAllHabits ? 'col-span-full min-[900px]:col-span-2 min-[1400px]:col-span-3' : ''}`}
    >
      <div
        className={`flex justify-between items-center font-mono ${isAllHabits ? 'text-lg' : 'text-sm'}`}
      >
        <span className="text-text-primary font-medium flex items-center gap-2">
          {renderedIcon}
          {name}
        </span>
        {stats && (
          <span className="text-text-secondary">
            {stats.currentStreak}d streak • {stats.completionRate}%
          </span>
        )}
      </div>

      <div
        className={`grid grid-flow-col grid-rows-7 gap-0.5 w-full ${gridColumnsClass}`}
      >
        {daysOfWeek.map((day) => (
          <div
            key={`header-${day.key}`}
            className="text-[10px] text-text-secondary font-mono flex items-center justify-center pr-2"
          >
            {day.label}
          </div>
        ))}
        {cells.map((cell) => (
          <GridCell
            key={cell.dateStr}
            value={cell.value}
            target={cell.target}
            color={color}
            habitName={name}
            dateStr={cell.dateStr}
            className="w-full aspect-square"
          />
        ))}
      </div>
    </div>
  )
}
