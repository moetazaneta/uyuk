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
import { useEffect, useMemo, useState } from 'react'

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

export function TableView({ dayCount: initialDayCount = 7 }: TableViewProps) {
  const settings = useQuery(api.users.settings)
  const habits = useQuery(api.habits.list)
  const upsertCompletion = useMutation(api.completions.upsert)
  const reorder = useMutation(api.habits.reorder)

  // Local ordered state avoids dnd-kit snap-back teleport: we own the order,
  // and only sync from server when it changes externally.
  const [orderedHabits, setOrderedHabits] = useState<NonNullable<typeof habits>>(habits ?? [])

  useEffect(() => {
    if (habits !== undefined) setOrderedHabits(habits)
  }, [habits])

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const dayCount = useMemo(() => {
    if (initialDayCount !== 7) return initialDayCount
    if (windowWidth < 768) return settings?.mobileTableViewDayCount ?? 7 // mobile
    if (windowWidth < 1024) return 14 // md
    if (windowWidth < 1280) return 21 // lg
    return 28 // xl/2xl
  }, [windowWidth, initialDayCount, settings?.mobileTableViewDayCount])

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
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id && orderedHabits) {
      const oldIndex = orderedHabits.findIndex((h) => h._id === active.id)
      const newIndex = orderedHabits.findIndex((h) => h._id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const next = [...orderedHabits]
        const [moved] = next.splice(oldIndex, 1)
        if (moved) {
          next.splice(newIndex, 0, moved)
          // Update local state immediately — no visual snap-back
          setOrderedHabits(next)
          void reorder({ ids: next.map((h) => h._id) })
        }
      }
    }
  }

  if (habits === undefined && orderedHabits.length === 0) {
    return (
      <div className="flex-1 overflow-auto bg-bg p-4 md:p-6" data-testid="table-loading">
        <TableHeader dates={dates} />
        <div className="flex flex-col">
           {[1, 2, 3].map((i) => (
             <div
               key={i}
               className="h-10 animate-pulse bg-bg-subtle"
             />
           ))}
        </div>
      </div>
    )
  }

  if (!orderedHabits || orderedHabits.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg text-text-secondary flex-col">
        <div className="text-center font-mono text-sm mb-4">No habits yet.</div>
        <Link
          to="/habits/new"
          className="text-sm font-sans text-text-secondary hover:text-text-primary transition-colors inline-block hover:bg-bg-subtle px-2 py-1"
        >
          + new habit
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-bg p-4 md:p-6" data-testid="table-view">
      <div className="min-w-max">
        <TableHeader
          dates={dates}
          showStats={settings?.showStatsInTable ?? false}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedHabits.map((h) => h._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col">
              {orderedHabits.map((habit) => {
                const habitCompletions = completionsMap[habit._id] ?? {}

                return (
                  <HabitRow
                    key={habit._id}
                    habit={habit}
                    dates={dates}
                    completionsByDate={habitCompletions}
                    showStats={settings?.showStatsInTable ?? false}
                    onUpdateCompletion={async (dateStr, value) => {
                      await upsertCompletion({
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

        <div className="pt-2 pb-4 px-2">
          <Link
            to="/habits/new"
            className="text-sm font-sans text-text-secondary hover:text-text-primary transition-colors inline-block hover:bg-bg-subtle px-2 py-1"
          >
            + new habit
          </Link>
        </div>
      </div>
    </div>
  )
}
