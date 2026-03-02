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
  cells: (CellData | null)[]
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

  // Bigger boxes for all habits, and 2x overall increase
  const cellWidth = isAllHabits ? 'w-10 sm:w-12 md:w-14' : 'w-6 md:w-7'
  const cellHeight = isAllHabits ? 'h-10 sm:h-12 md:h-14' : 'h-6 md:h-7'
  const gap = isAllHabits ? 'gap-2' : 'gap-1'

  const renderedIcon = icon ? (
    icon.type === 'emoji' ? (
      icon.value
    ) : (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="inline-block mr-1"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  ) : null

  return (
    <div
      className={`bg-bg-elevated p-4 flex flex-col gap-4 ${isAllHabits ? 'col-span-full xl:col-span-2 2xl:col-span-3' : ''}`}
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
        className={`grid grid-flow-col grid-rows-7 w-fit ${gap} overflow-x-auto pb-2`}
      >
        {daysOfWeek.map((day, i) => (
          <div
            key={`header-${i}`}
            className={`text-[10px] text-text-secondary text-right pr-2 font-mono flex items-center justify-end ${cellHeight}`}
          >
            {day}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (!cell) {
            return (
              <div
                key={`pad-${i}`}
                className={`${cellWidth} ${cellHeight} flex-shrink-0`}
              />
            )
          }
          return (
            <GridCell
              key={cell.dateStr}
              value={cell.value}
              target={cell.target}
              color={color}
              habitName={name}
              dateStr={cell.dateStr}
              className={`${cellWidth} ${cellHeight}`}
            />
          )
        })}
      </div>
    </div>
  )
}
