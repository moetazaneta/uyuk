import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'

import type { Doc } from '../../../convex/_generated/dataModel'
import { HabitRow } from './HabitRow'

vi.mock('convex/react', () => ({
  useQuery: () => ({ currentStreak: 7, completionRate: 85 }),
  useMutation: () => fn(),
}))

const meta: Meta<typeof HabitRow> = {
  title: 'Table/HabitRow',
  component: HabitRow,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <DndContext>
        <SortableContext
          items={['habit1']}
          strategy={verticalListSortingStrategy}
        >
          <Story />
        </SortableContext>
      </DndContext>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof HabitRow>

const today = new Date()
const dates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today.getTime() - (6 - i) * 86400000)
  return {
    dateStr: d.toISOString().slice(0, 10),
    isToday: i === 6,
  }
})

const mockHabit: Doc<'habits'> = {
  _id: 'habit1' as Doc<'habits'>['_id'],
  _creationTime: Date.now(),
  userId: 'user1' as Doc<'habits'>['userId'],
  name: 'Drink water',
  iconType: 'emoji',
  iconValue: '💧',
  color: '#3b82f6',
  type: 'numeric',
  target: 8,
  sortOrder: 0,
  isArchived: false,
  isDeleted: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

const completionsByDate = Object.fromEntries(
  dates.map((d, i) => [d.dateStr, i % 3 === 0 ? 8 : i % 2 === 0 ? 4 : 0]),
)

export const Default: Story = {
  args: {
    habit: mockHabit,
    dates,
    completionsByDate,
    showStats: false,
    onUpdateCompletion: fn(),
  },
}

export const WithStats: Story = {
  args: {
    habit: mockHabit,
    dates,
    completionsByDate,
    showStats: true,
    onUpdateCompletion: fn(),
  },
}

export const BooleanHabit: Story = {
  args: {
    habit: {
      ...mockHabit,
      name: 'Exercise',
      iconValue: '💪',
      type: 'boolean',
      target: 1,
      color: '#22c55e',
    },
    dates,
    completionsByDate: Object.fromEntries(
      dates.map((d, i) => [d.dateStr, i % 2 === 0 ? 1 : 0]),
    ),
    showStats: false,
    onUpdateCompletion: fn(),
  },
}
