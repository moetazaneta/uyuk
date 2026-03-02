export interface TableHeaderProps {
  dates: {
    dateStr: string
    label: string
    dayOfMonth: string
    isToday: boolean
  }[]
  showStats?: boolean
}

export function TableHeader({ dates, showStats = false }: TableHeaderProps) {
  return (
    <div className="flex items-end h-12 px-3 border-b border-divider sticky top-0 bg-bg z-10">
      {/* Spacer for drag handle(24) + icon(24+mr8) + name + flex-1 */}
      {/* Just use flex-1 to push the dates to the right, matching HabitRow */}
      <div className="flex-1" />

      <div className="flex">
        {dates.map(({ dateStr, label, dayOfMonth, isToday }) => {
          const colorClass = isToday ? 'text-text-primary font-bold' : 'text-text-secondary'

          return (
            <div
              key={dateStr}
              className={`flex flex-col items-center justify-end w-9 md:w-7 lg:w-8 pb-2 font-mono text-[10px] leading-tight ${colorClass}`}
            >
              <span className="uppercase">{label}</span>
              <span>{dayOfMonth}</span>
            </div>
          )
        })}
      </div>

      {showStats && (
        <div className="w-[80px] ml-4 flex items-end justify-end pb-2 font-mono text-xs text-text-secondary">
          STATS
        </div>
      )}
    </div>
  )
}
