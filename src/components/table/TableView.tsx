import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Link } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useMemo } from 'react'

import { api } from '~/../convex/_generated/api'

import { HabitRow } from './HabitRow'
import { TableHeader } from './TableHeader'

function formatDate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDayLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}

function getDayOfMonth(d: Date): string {
  return d.getDate().toString()
}

export interface TableViewProps {
  dayCount?: number
}

export function TableView({ dayCount = 7 }: TableViewProps) {
  const habits = useQuery(api.habits.list)
  const upsertCompletion = useMutation(api.completions.upsert)
  const reorder = useMutation(api.habits.reorder)

  // Compute dates array (from today backwards)
  // We want left-to-right to be oldest-to-newest, so reverse the backwards array.
  const dates = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const arr = []
    for (let i = dayCount - 1; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 86400000)
      const dateStr = formatDate(d)
      arr.push({
        dateStr,
        label: getDayLabel(d),
        dayOfMonth: getDayOfMonth(d),
        isToday: i === 0,
      })
    }
    return arr
  }, [dayCount])

  const startDate = dates[0]?.dateStr ?? ''
  const endDate = dates[dates.length - 1]?.dateStr ?? ''

  const completions = useQuery(
    api.completions.byDateRange,
    startDate && endDate ? { startDate, endDate } : 'skip',
  )

  // O(1) lookup map: habitId -> date -> value
  const completionsMap = useMemo(() => {
    const map: Record<string, Record<string, number>> = {}
    if (completions) {
      for (const c of completions) {
        if (!map[c.habitId]) map[c.habitId] = {}
        map[c.habitId]![c.date] = c.value
      }
    }
    return map
  }, [completions])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id && habits) {
      const oldIndex = habits.findIndex((h) => h._id === active.id)
      const newIndex = habits.findIndex((h) => h._id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newHabits = [...habits]
        const [moved] = newHabits.splice(oldIndex, 1)
        if (moved) {
          newHabits.splice(newIndex, 0, moved)
          reorder({ ids: newHabits.map((h) => h._id) })
        }
      }
    }
  }

  if (habits === undefined) {
    return (
      <div className="flex-1 overflow-auto bg-bg" data-testid="table-loading">
        <TableHeader dates={dates} />
        <div className="flex flex-col">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 border-b border-divider bg-bg-subtle/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg text-text-secondary">
        <div className="text-center font-mono text-sm">
          No habits yet.{' '}
          <Link to="/habits/new" className="text-focus hover:underline">
            Create your first habit →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-bg" data-testid="table-view">
      <div className="min-w-[600px]">
        <TableHeader dates={dates} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={habits.map((h) => h._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col">
              {habits.map((habit) => {
                const habitCompletions = completionsMap[habit._id] ?? {}

                return (
                  <HabitRow
                    key={habit._id}
                    habit={habit}
                    dates={dates}
                    completionsByDate={habitCompletions}
                    onUpdateCompletion={(dateStr, value) => {
                      upsertCompletion({
                        habitId: habit._id,
                        date: dateStr,
                        value,
                      })
                    }}
                  />
                )
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
