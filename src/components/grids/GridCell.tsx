import { useMemo } from 'react'

export interface GridCellProps {
  value: number
  target: number
  color: string
}

export function GridCell({ value, target, color }: GridCellProps) {
  // Intensity is determined by completion percentage.
  const intensity = useMemo(() => {
    if (value === 0 || target === 0) return 0
    const percentage = (value / target) * 100

    if (percentage > 0 && percentage <= 25) return 0.25
    if (percentage > 25 && percentage <= 50) return 0.5
    if (percentage > 50 && percentage <= 75) return 0.75
    return 1 // 76% to 100%
  }, [value, target])

  return (
    <div className="w-3 h-3 md:w-3.5 md:h-3.5 bg-bg-subtle relative overflow-hidden flex-shrink-0">
      {intensity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: color,
            opacity: intensity,
          }}
        />
      )}
    </div>
  )
}
