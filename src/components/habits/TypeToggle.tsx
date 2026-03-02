export interface TypeToggleProps {
  value: 'boolean' | 'numeric'
  onChange: (value: 'boolean' | 'numeric') => void
}

export function TypeToggle({ value, onChange }: TypeToggleProps) {
  return (
    <div className="flex w-full h-8 bg-bg-subtle text-sm font-sans font-medium">
      <button
        type="button"
        onClick={() => onChange('boolean')}
        className={`flex-1 flex items-center justify-center transition-colors ${
          value === 'boolean'
            ? 'bg-[#ededed] text-[#0a0a0a]'
            : 'text-[#a1a1a1] hover:text-[#ededed]'
        }`}
      >
        Boolean
      </button>
      <button
        type="button"
        onClick={() => onChange('numeric')}
        className={`flex-1 flex items-center justify-center transition-colors ${
          value === 'numeric'
            ? 'bg-[#ededed] text-[#0a0a0a]'
            : 'text-[#a1a1a1] hover:text-[#ededed]'
        }`}
      >
        Numeric
      </button>
    </div>
  )
}
