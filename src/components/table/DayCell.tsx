import { useEffect, useState } from 'react'

import { NumericInput } from './NumericInput'

export interface DayCellProps {
  date: string
  isToday: boolean
  value: number
  target: number
  habitType: 'boolean' | 'numeric'
  habitColor: string
  habitName: string
  onUpdate: (value: number) => Promise<void> | void
}
export function DayCell({
  date,
  isToday,
  value,
  target,
  habitType,
  habitColor,
  habitName,
  onUpdate,
}: DayCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [optimisticValue, setOptimisticValue] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const displayValue = optimisticValue !== null ? optimisticValue : value

  // Reset optimistic value if actual value changes
  useEffect(() => {
    setOptimisticValue(null)
  }, [value])
  // Calculate percentage for fill
  const percentage = Math.min((displayValue / target) * 100, 100)

  // Determine base background
  const isZero = displayValue === 0
  const baseBg = isToday
    ? 'bg-bg-subtle border-b-2 border-focus'
    : isZero
      ? 'bg-bg-subtle'
      : 'bg-bg'

  // Use habit color with opacity if partial, or full if 100%
  // But actually, the requirements say:
  // "0% = bg-bg-subtle (#1a1a1a)"
  // "Partial = habit color at some opacity (use style={{ backgroundColor: colorWithOpacity }})"
  // "100% = full habit color"
  // "Boolean: Fill from bottom based on % (use CSS clip-path or absolute positioned fill div)"

  // Actually, wait: "Fill from bottom based on %"
  // If it's a fill div from bottom:
  // Container has base background (`bg-bg-subtle`).
  // The inner fill div has `height: percentage + '%'` and `backgroundColor: habitColor`.
  // Let's do that!

  const handleTap = async () => {
    if (habitType === 'boolean') {
      const newValue = displayValue + 1
      setOptimisticValue(newValue)
      setError(null)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 100)

      try {
        await onUpdate(newValue)
      } catch {
        setOptimisticValue(null)
        setError('Failed to save. Try again.')
        setTimeout(() => setError(null), 3000)
      }
    } else {
      setIsEditing(true)
    }
  }

  const handleSaveNumeric = async (newValue: number) => {
    setOptimisticValue(newValue)
    setIsEditing(false)
    setError(null)

    try {
      await onUpdate(newValue)
    } catch {
      setOptimisticValue(null)
      setError('Failed to save. Try again.')
      setTimeout(() => setError(null), 3000)
    }
  }

  // Format date for aria-label
  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj)

  const ariaLabel = `${habitName}, ${formattedDate}: ${displayValue} / ${target}`

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        className={`relative flex items-end justify-center w-7 h-7 min-w-[36px] min-h-[36px] md:min-w-0 md:min-h-0 md:w-7 md:h-7 lg:w-8 lg:h-8 cursor-pointer overflow-hidden transition-transform duration-100 ${
          isAnimating ? 'scale-105' : ''
        } ${baseBg}`}
        onClick={handleTap}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleTap()
          }
        }}
      >
        {/* Fill div */}
        {percentage > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 w-full"
            style={{
              height: `${percentage}%`,
              backgroundColor: habitColor,
              opacity: percentage < 100 ? 0.6 : 1,
            }}
          />
        )}
        {/* Numeric value text overlay if numeric */}
        {habitType === 'numeric' && displayValue > 0 && !isEditing && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-text-primary z-10 pointer-events-none drop-shadow-md">
            {displayValue}
          </span>
        )}

        {/* Inline Numeric Input */}
        {isEditing && (
          <NumericInput
            initialValue={displayValue}
            onSave={handleSaveNumeric}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </button>
      {error && (
        <p className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-error text-[10px] whitespace-nowrap bg-bg px-1 z-50">
          {error}
        </p>
      )}
    </div>
  )
}
