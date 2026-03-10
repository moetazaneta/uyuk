import type { Meta, StoryObj } from '@storybook/react'

import type { CellData } from './HabitGrid'
import { HabitGrid } from './HabitGrid'

vi.mock('convex/react', () => ({
  useQuery: () => ({ currentStreak: 12, completionRate: 78 }),
  useMutation: () => () => Promise.resolve(),
}))

const meta: Meta<typeof HabitGrid> = {
  title: 'Grids/HabitGrid',
  component: HabitGrid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HabitGrid>

const today = new Date()
const cells: CellData[] = Array.from({ length: 98 }, (_, i) => {
  const d = new Date(today.getTime() - (97 - i) * 86400000)
  return {
    dateStr: d.toISOString().slice(0, 10),
    value: Math.random() > 0.3 ? 1 : 0,
    target: 1,
  }
})

export const WithStats: Story = {
  args: {
    name: 'Drink water',
    icon: { type: 'emoji', value: '💧' },
    color: '#3b82f6',
    cells,
    stats: { currentStreak: 12, completionRate: 78 },
  },
}

export const WithFetchedStats: Story = {
  args: {
    name: 'Exercise',
    icon: { type: 'emoji', value: '💪' },
    color: '#22c55e',
    cells,
  },
}

export const AllHabits: Story = {
  args: {
    name: 'All Habits',
    color: '#ededed',
    cells: cells.map((c) => ({ ...c, value: c.value * 3, target: 3 })),
    stats: null,
    isAllHabits: true,
  },
}

export const SundayStart: Story = {
  args: {
    name: 'Read',
    icon: { type: 'emoji', value: '📚' },
    color: '#a855f7',
    cells,
    weekStart: 'sunday',
    stats: { currentStreak: 5, completionRate: 60 },
  },
}
