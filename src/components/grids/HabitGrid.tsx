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
      ? ['M', 'T', 'W', 'T', 'F', 'S', 'S']
      : ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  // Container-query based cell sizing — fills the card width across 15 columns (7 day labels + 14 data cols)
  const cellSize = 'w-[calc((100cqw-3.75rem)/15)] h-[calc((100cqw-3.75rem)/15)]'
  const gap = 'gap-0.5'

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
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  ) : null

  return (
    <div
      className={`@container bg-bg-elevated p-4 flex flex-col gap-4 ${isAllHabits ? 'col-span-full xl:col-span-2 2xl:col-span-3' : ''}`}
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
        className={`grid grid-flow-col grid-rows-7 w-full ${gap} pb-2`}
      >
        {daysOfWeek.map((day, i) => (
          <div
            key={`header-${i}`}
            className={`text-[10px] text-text-secondary text-right pr-2 font-mono flex items-center justify-end ${cellSize}`}
          >
            {day}
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
            className={cellSize}
          />
        ))}
      </div>
    </div>
  )
}
