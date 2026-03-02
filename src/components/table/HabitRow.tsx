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
  showStats?: boolean
  onUpdateCompletion: (date: string, value: number) => Promise<void> | void
}

export function HabitRow({
  habit,
  dates,
  completionsByDate,
  showStats = false,
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
      className="flex items-center h-9 md:h-7 lg:h-8 hover:bg-bg-subtle group border-b border-divider last:border-b-0"
      {...attributes}
      {...listeners}
    >
      <div className="text-text-disabled cursor-grab active:cursor-grabbing w-6 flex-shrink-0 items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity hidden md:flex">
        ⠿
      </div>

      <div className="w-5 flex-shrink-0 flex items-center justify-center text-sm md:mr-2 pl-2">
        {icon}
      </div>

      <div className="font-sans text-sm text-text-primary truncate max-w-[90px] sm:max-w-[130px] md:max-w-[120px] lg:max-w-[180px] mr-2">
        {habit.name}
      </div>

      <div className="flex-1" />

      <div className="flex">
        {dates.map(({ dateStr, isToday }) => {
          const value = completionsByDate[dateStr] ?? 0

          return (
            <div key={dateStr} onPointerDown={(e) => e.stopPropagation()}>
              <DayCell
                date={dateStr}
                isToday={isToday}
                value={value}
                target={habit.target}
                habitType={habit.type}
                habitColor={habit.color}
                habitName={habit.name}
                onUpdate={(newValue) => onUpdateCompletion(dateStr, newValue)}
              />
            </div>
          )
        })}
      </div>

      {showStats && (
        <div className="w-[80px] ml-4 text-right font-mono text-xs text-text-secondary flex-shrink-0">
          {statsDisplay}
        </div>
      )}
    </div>
  )
}
