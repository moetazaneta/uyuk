import type React from 'react'
import type { SVGProps } from 'react'

export interface IconPickerProps {
  value: { type: 'emoji' | 'icon'; value: string }
  onChange: (value: { type: 'emoji' | 'icon'; value: string }) => void
}

const EMOJIS = [
  '💪',
  '🏃',
  '💧',
  '📚',
  '🧘',
  '🎯',
  '✅',
  '⚡',
  '🔥',
  '🌙',
  '💤',
  '🎵',
  '🍎',
  '🏋️',
  '🧠',
  '💊',
  '🚶',
  '🖊️',
  '🎨',
  '🌿',
]

const ICONS: Record<
  string,
  (props: SVGProps<SVGSVGElement>) => React.ReactNode
> = {
  Activity: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Target: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  BookOpen: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Droplets: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7 2.9 7 2.9s-2.28 6.16-3.29 7.16C2.57 11.02 2 12.26 2 13.42 2 15.65 3.8 17.5 6 17.5Z" />
      <path d="M12 18.5c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S12 5.1 12 5.1s-2.28 6.16-3.29 7.16C7.57 13.19 7 14.33 7 15.42 7 17.65 8.8 19.5 11 19.5Z" />
      <path d="M17 20.7c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S17 7.3 17 7.3s-2.28 6.16-3.29 7.16c-1.14 1.13-1.71 2.27-1.71 3.36 0 2.23 1.8 4.08 4 4.08Z" />
    </svg>
  ),
  Moon: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  ),
  Flame: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
  Zap: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Music: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  Apple: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </svg>
  ),
  Brain: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    </svg>
  ),
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const isEmojiTab = value.type === 'emoji'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 text-sm font-mono border-b border-divider pb-1">
        <button
          type="button"
          onClick={() => onChange({ type: 'emoji', value: EMOJIS[0] })}
          className={`px-3 py-1 transition-colors ${isEmojiTab ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          emoji
        </button>
        <button
          type="button"
          onClick={() =>
            onChange({ type: 'icon', value: Object.keys(ICONS)[0] })
          }
          className={`px-3 py-1 transition-colors ${!isEmojiTab ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          icon
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 p-1">
        {isEmojiTab
          ? EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onChange({ type: 'emoji', value: emoji })}
                className={`h-10 text-xl flex items-center justify-center transition-all ${
                  value.type === 'emoji' && value.value === emoji
                    ? 'bg-focus/20 outline-2 outline-focus outline-offset-2'
                    : 'bg-bg-subtle hover:bg-bg-elevated'
                }`}
              >
                {emoji}
              </button>
            ))
          : Object.entries(ICONS).map(([name, Icon]) => (
              <button
                key={name}
                type="button"
                onClick={() => onChange({ type: 'icon', value: name })}
                className={`h-10 text-xl flex items-center justify-center transition-all ${
                  value.type === 'icon' && value.value === name
                    ? 'bg-focus/20 outline-2 outline-focus outline-offset-2 text-focus'
                    : 'bg-bg-subtle text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
      </div>
    </div>
  )
}
