export interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
}

const COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#6366f1',
  '#a855f7',
  '#ec4899',
  '#64748b',
  '#84cc16',
  '#f43f5e',
]

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 w-24">
        {COLORS.map((color) => {
          const isSelected = value === color
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`w-6 h-6 transition-transform ${isSelected ? 'scale-110 z-10' : 'hover:scale-105 z-0'}`}
              style={{
                backgroundColor: color,
                outline: isSelected ? `2px solid ${color}` : 'none',
                outlineOffset: isSelected ? '2px' : '0',
              }}
              aria-label={`Select color ${color}`}
            />
          )
        })}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="customHex"
          className="text-xs font-sans text-text-secondary"
        >
          Custom Hex
        </label>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 shrink-0"
            style={{ backgroundColor: value }}
          />
          <input
            id="customHex"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-bg-subtle text-text-primary font-mono text-sm px-2 py-1 border-b border-divider focus:outline-none focus:border-focus transition-colors"
            placeholder="#000000"
            maxLength={7}
          />
        </div>
      </div>
    </div>
  )
}
