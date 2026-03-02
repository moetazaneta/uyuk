import { useEffect, useRef, useState } from 'react'

export interface NumericInputProps {
  initialValue: number
  onSave: (value: number) => void
  onCancel: () => void
}

export function NumericInput({
  initialValue,
  onSave,
  onCancel,
}: NumericInputProps) {
  const [value, setValue] = useState(initialValue.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      save()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  const save = () => {
    const num = parseFloat(value)
    if (!isNaN(num)) {
      onSave(num)
    } else {
      onCancel()
    }
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg-elevated">
      <input
        ref={inputRef}
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={save}
        className="w-16 h-8 bg-bg-subtle text-text-primary text-center font-mono text-sm outline-none border border-focus"
        step="any"
      />
    </div>
  )
}
