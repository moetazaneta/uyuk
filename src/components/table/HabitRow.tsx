import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from 'convex/react'

import { api } from '~/../convex/_generated/api'
import type { Doc } from '~/../convex/_generated/dataModel'

import { DayCell } from './DayCell'

export interface HabitRowProps {
  habit: Doc<'habits'>
  dates: { dateStr: string; isToday: boolean }[]
  completionsByDate: Record<string, number> // Map of date string to value
  onUpdateCompletion: (date: string, value: number) => void
}

export function HabitRow({
  habit,
  dates,
  completionsByDate,
  onUpdateCompletion,
}: HabitRowProps) {
  const stats = useQuery(api.stats.forHabit, { habitId: habit._id })

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  }

  // 1. Drag handle: ⠿ or ≡
  // 2. Icon (emoji or simple svg placeholder)
  const icon =
    habit.iconType === 'emoji' ? (
      habit.iconValue
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )

  const statsDisplay = stats
    ? `${stats.currentStreak}🔥 ${Math.round(stats.completionRate)}%`
    : '...'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center h-10 px-3 border-b border-divider hover:bg-bg-subtle group"
    >
      <div
        {...attributes}
        {...listeners}
        className="text-text-disabled cursor-grab active:cursor-grabbing w-6 flex-shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ⠿
      </div>

      <div className="w-6 flex-shrink-0 flex items-center justify-center text-sm mr-2">
        {icon}
      </div>

      <div className="font-sans text-sm text-text-primary truncate max-w-[120px] sm:max-w-[160px] mr-2">
        {habit.name}
      </div>

      <div className="flex-1" />

      <div className="flex">
        {dates.map(({ dateStr, isToday }) => {
          const value = completionsByDate[dateStr] ?? 0

          return (
            <DayCell
              key={dateStr}
              date={dateStr}
              isToday={isToday}
              value={value}
              target={habit.target}
              habitType={habit.type}
              habitColor={habit.color}
              onUpdate={(newValue) => onUpdateCompletion(dateStr, newValue)}
            />
          )
        })}
      </div>

      <div className="w-[80px] ml-4 text-right font-mono text-xs text-text-secondary flex-shrink-0">
        {statsDisplay}
      </div>
    </div>
  )
}
