import { Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { useMemo } from 'react'

import { api } from '~/../convex/_generated/api'

import { HabitGrid, type CellData } from './HabitGrid'

function formatDate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function GridsView() {
  const settings = useQuery(api.users.settings)
  const habits = useQuery(api.habits.list)

  const {
    startDate,
    endDate,
    daysInMonth,
    startOffset,
    monthLabel,
    year,
    month,
  } = useMemo(() => {
    const today = new Date()
    const y = today.getFullYear()
    const m = today.getMonth()

    const firstDay = new Date(y, m, 1)
    const lastDay = new Date(y, m + 1, 0)

    const weekStart = settings?.weekStartDay ?? 'monday'
    let offset = firstDay.getDay()
    if (weekStart === 'monday') {
      offset = offset - 1
      if (offset === -1) offset = 6
    }

    const sDate = formatDate(firstDay)
    const eDate = formatDate(lastDay)

    const monthName = firstDay.toLocaleString('en-US', { month: 'long' })
    const mLabel = `${monthName} ${y}`

    return {
      startDate: sDate,
      endDate: eDate,
      daysInMonth: lastDay.getDate(),
      startOffset: offset,
      monthLabel: mLabel,
      year: y,
      month: m,
    }
  }, [settings?.weekStartDay])

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

  if (
    habits === undefined ||
    completions === undefined ||
    settings === undefined
  ) {
    return (
      <div
        className="flex-1 overflow-auto bg-bg p-4 md:p-6"
        data-testid="grids-loading"
      >
        <h1 className="text-xl md:text-2xl font-bold mb-4 font-mono text-text-primary">
          grids
        </h1>
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-bg-elevated p-4 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div className="flex-1 overflow-auto bg-bg p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4 font-mono text-text-primary">
          grids
        </h1>
        <div className="flex-1 flex items-center justify-center text-text-secondary h-[50vh]">
          <div className="text-center font-mono text-sm">
            No habits yet.{' '}
            <Link to="/habits/new" className="text-focus hover:underline">
              Create your first habit →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const allHabitsCells: (CellData | null)[] = []
  for (let i = 0; i < startOffset; i++) {
    allHabitsCells.push(null)
  }

  const allHabitsDateValues: Record<string, { value: number; target: number }> =
    {}

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d)
    const dateStr = formatDate(dateObj)
    allHabitsDateValues[dateStr] = { value: 0, target: 0 }

    for (const habit of habits) {
      allHabitsDateValues[dateStr]!.target += habit.target
      const val = completionsMap[habit._id]?.[dateStr] ?? 0
      allHabitsDateValues[dateStr]!.value += Math.min(val, habit.target)
    }

    allHabitsCells.push({
      dateStr,
      value: allHabitsDateValues[dateStr]!.value,
      target: allHabitsDateValues[dateStr]!.target,
    })
  }

  return (
    <div
      className="flex-1 overflow-auto bg-bg p-4 md:p-6"
      data-testid="grids-view"
    >
      <h1 className="text-xl md:text-2xl font-bold mb-4 font-mono text-text-primary">
        grids
      </h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pb-20">
        <HabitGrid
          name="All Habits"
          color="#ededed"
          cells={allHabitsCells}
          monthLabel={monthLabel}
          stats={null}
          weekStart={
            (settings?.weekStartDay as 'monday' | 'sunday') ?? 'monday'
          }
        />
        {habits.map((habit) => {
          const cells: (CellData | null)[] = []
          for (let i = 0; i < startOffset; i++) {
            cells.push(null)
          }
          for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d)
            const dateStr = formatDate(dateObj)
            cells.push({
              dateStr,
              value: completionsMap[habit._id]?.[dateStr] ?? 0,
              target: habit.target,
            })
          }

          return (
            <HabitGrid
              key={habit._id}
              habitId={habit._id}
              name={habit.name}
              color={habit.color}
              cells={cells}
              monthLabel={monthLabel}
              weekStart={
                (settings?.weekStartDay as 'monday' | 'sunday') ?? 'monday'
              }
            />
          )
        })}
      </div>
    </div>
  )
}
