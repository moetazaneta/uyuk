import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'

import { api } from '../../../../../convex/_generated/api'
import type { Id } from '../../../../../convex/_generated/dataModel'
import { HabitForm } from '../../../../components/habits/HabitForm'

export const Route = createFileRoute('/_authenticated/habits/$habitId/edit')({
  component: EditHabitRoute,
})

function EditHabitRoute() {
  const { habitId } = Route.useParams()
  const navigate = useNavigate()

  const habit = useQuery(api.habits.getById, { id: habitId as Id<'habits'> })

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
          edit habit
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
        {habit === undefined ? (
          <div className="text-text-secondary font-mono">loading...</div>
        ) : habit === null ? (
          <div className="text-[#ef4444] font-mono">habit not found</div>
        ) : (
          <HabitForm
            habitId={habit._id}
            initialValues={{
              name: habit.name,
              description: habit.description || '',
              iconType: habit.iconType,
              iconValue: habit.iconValue,
              color: habit.color,
              type: habit.type,
              target: habit.target,
            }}
            onSuccess={() => navigate({ to: '/table' })}
            onCancel={() => navigate({ to: '/table' })}
          />
        )}
      </div>
    </div>
  )
}
