import { useState } from 'react'

import { NumericInput } from './NumericInput'

export interface DayCellProps {
  date: string
  isToday: boolean
  value: number
  target: number
  habitType: 'boolean' | 'numeric'
  habitColor: string
  onUpdate: (value: number) => void
}

export function DayCell({
  isToday,
  value,
  target,
  habitType,
  habitColor,
  onUpdate,
}: DayCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Calculate percentage for fill
  const percentage = Math.min((value / target) * 100, 100)

  // Determine base background
  const isZero = value === 0
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

  const handleTap = () => {
    if (habitType === 'boolean') {
      onUpdate(value + 1)

      // Trigger animation
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 100)
    } else {
      setIsEditing(true)
    }
  }

  const handleSaveNumeric = (newValue: number) => {
    onUpdate(newValue)
    setIsEditing(false)
  }

  return (
    <button
      type="button"
      className={`relative flex items-end justify-center w-7 h-7 lg:w-8 lg:h-8 cursor-pointer overflow-hidden transition-transform duration-100 ${
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
      {habitType === 'numeric' && value > 0 && !isEditing && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-text-primary z-10 pointer-events-none drop-shadow-md">
          {value}
        </span>
      )}

      {/* Checkmark overlay if boolean and >= 100% ? Not requested, keep it simple. */}

      {/* Inline Numeric Input */}
      {isEditing && (
        <NumericInput
          initialValue={value}
          onSave={handleSaveNumeric}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </button>
  )
}
