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
  color: string
  cells: (CellData | null)[]
  monthLabel: string
  habitId?: Id<'habits'>
  stats?: { currentStreak: number; completionRate: number } | null
  weekStart?: 'monday' | 'sunday'
}

export function HabitGrid({
  name,
  color,
  cells,
  monthLabel,
  habitId,
  stats: providedStats,
  weekStart = 'monday',
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

  return (
    <div className="bg-bg-elevated p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm font-mono">
        <span className="text-text-primary font-medium">{name}</span>
        {stats && (
          <span className="text-text-secondary">
            {stats.currentStreak}d streak • {stats.completionRate}%
          </span>
        )}
      </div>

      <div className="text-xs text-text-secondary font-mono mt-1 mb-1">
        {monthLabel}
      </div>

      <div className="grid grid-cols-7 gap-0 w-fit">
        {daysOfWeek.map((day, i) => (
          <div
            key={`header-${i}`}
            className="text-[10px] text-text-secondary text-center font-mono w-3 md:w-3.5 mb-1"
          >
            {day}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (!cell) {
            return (
              <div
                key={`pad-${i}`}
                className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0"
              />
            )
          }
          return (
            <GridCell
              key={cell.dateStr}
              value={cell.value}
              target={cell.target}
              color={color}
            />
          )
        })}
      </div>
    </div>
  )
}
