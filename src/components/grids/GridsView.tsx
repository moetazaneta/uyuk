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

  const { dates, startDate, endDate } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekStart = settings?.weekStartDay ?? 'monday'

    // Determine what weekday today is (0=Sun…6=Sat), adjusted for week start
    let todayDow = today.getDay()
    if (weekStart === 'monday') {
      todayDow = todayDow === 0 ? 6 : todayDow - 1
    }

    // Today is in row (todayDow) of the last column (col 13, 0-indexed).
    // So the grid starts 13 full weeks + todayDow days ago = 13*7 + todayDow days ago.
    // Total cells = 14 * 7 = 98, always a perfect rectangle.
    const totalDays = 14 * 7 // 98
    const daysBack = 13 * 7 + todayDow // days from grid-start to today

    const datesArr: { dateStr: string; dateObj: Date }[] = []
    for (let i = daysBack; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 86400000)
      datesArr.push({ dateStr: formatDate(d), dateObj: d })
    }

    // Pad future days to complete the rectangle (should be 0 since today ends at row todayDow)
    // Actually: daysBack + 1 days total. We need totalDays. Pad with future dates if needed.
    let cursor = new Date(today.getTime() + 86400000)
    while (datesArr.length < totalDays) {
      datesArr.push({ dateStr: formatDate(cursor), dateObj: new Date(cursor) })
      cursor = new Date(cursor.getTime() + 86400000)
    }

    return {
      dates: datesArr,
      startDate: datesArr[0]?.dateStr ?? '',
      endDate: datesArr[datesArr.length - 1]?.dateStr ?? '',
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
        <div className="flex-1 flex flex-col items-center justify-center text-text-secondary h-[50vh]">
          <div className="text-center font-mono text-sm">No habits yet.</div>
          <Link
            to="/habits/new"
            className="text-sm font-sans text-text-secondary hover:text-text-primary transition-colors border border-divider px-4 py-2 mt-4"
          >
            + new habit
          </Link>
        </div>
      </div>
    )
  }

  // Build allHabits cells — no offset nulls needed, pure 98-day rectangle
  const allHabitsCells: CellData[] = dates.map(({ dateStr }) => {
    let value = 0
    let target = 0
    for (const habit of habits) {
      target += habit.target
      const val = completionsMap[habit._id]?.[dateStr] ?? 0
      value += Math.min(val, habit.target)
    }
    return { dateStr, value, target }
  })

  return (
    <div
      className="flex-1 overflow-auto bg-bg p-4 md:p-6"
      data-testid="grids-view"
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pb-20">
        <HabitGrid
          name="All Habits"
          color="#ededed"
          cells={allHabitsCells}
          stats={null}
          weekStart={
            (settings?.weekStartDay as 'monday' | 'sunday') ?? 'monday'
          }
          isAllHabits={true}
        />
        {habits.map((habit) => {
          const cells: CellData[] = dates.map(({ dateStr }) => ({
            dateStr,
            value: completionsMap[habit._id]?.[dateStr] ?? 0,
            target: habit.target,
          }))

          return (
            <HabitGrid
              key={habit._id}
              habitId={habit._id}
              name={habit.name}
              icon={
                habit.iconType && habit.iconValue
                  ? {
                      type: habit.iconType as 'emoji' | 'icon',
                      value: habit.iconValue,
                    }
                  : undefined
              }
              color={habit.color}
              cells={cells}
              weekStart={
                (settings?.weekStartDay as 'monday' | 'sunday') ?? 'monday'
              }
              isAllHabits={false}
            />
          )
        })}
      </div>
    </div>
  )
}
