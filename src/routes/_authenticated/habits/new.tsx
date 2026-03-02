import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { HabitForm } from '../../../components/habits/HabitForm'

export const Route = createFileRoute('/_authenticated/habits/new')({
  component: NewHabitRoute,
})

function NewHabitRoute() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 p-6 h-full flex flex-col max-w-[480px] w-full mx-auto">
      <div className="flex items-center mb-6 gap-4">
        <button
          onClick={() => navigate({ to: '/table' })}
          className="text-text-secondary hover:text-text-primary text-xl px-2 -ml-2 transition-colors"
          aria-label="Go back"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold font-mono text-text-primary">
          new habit
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
        <HabitForm
          onSuccess={() => navigate({ to: '/table' })}
          onCancel={() => navigate({ to: '/table' })}
        />
      </div>
    </div>
  )
}
