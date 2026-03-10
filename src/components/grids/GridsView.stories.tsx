import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'

import { RouterDecorator } from '../../../.storybook/preview'
import { GridsView } from './GridsView'

const mockHabits = [
  {
    _id: 'habit1',
    _creationTime: Date.now(),
    userId: 'user1',
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
  },
  {
    _id: 'habit2',
    _creationTime: Date.now(),
    userId: 'user1',
    name: 'Exercise',
    iconType: 'emoji',
    iconValue: '💪',
    color: '#22c55e',
    type: 'boolean',
    target: 1,
    sortOrder: 1,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

const mockSettings = {
  _id: 'settings1',
  _creationTime: Date.now(),
  userId: 'user1',
  weekStartDay: 'monday',
  showStatsInTable: false,
  mobileTableViewDayCount: 7,
  timezone: 'America/New_York',
  name: 'Test User',
}

vi.mock('convex/react', () => ({
  useQuery: (query: unknown) => {
    const key = String(query)
    if (key.includes('settings')) return mockSettings
    if (key.includes('habits')) return mockHabits
    if (key.includes('completions')) return []
    if (key.includes('stats')) return { currentStreak: 5, completionRate: 70 }
    return undefined
  },
  useMutation: () => fn(),
}))

const meta: Meta<typeof GridsView> = {
  title: 'Grids/GridsView',
  component: GridsView,
  decorators: [RouterDecorator],
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof GridsView>

export const WithHabits: Story = {}

export const Empty: Story = {
  beforeEach() {
    vi.mock('convex/react', () => ({
      useQuery: (query: unknown) => {
        const key = String(query)
        if (key.includes('settings')) return mockSettings
        if (key.includes('habits')) return []
        if (key.includes('completions')) return []
        return undefined
      },
      useMutation: () => fn(),
    }))
  },
}

export const Loading: Story = {
  beforeEach() {
    vi.mock('convex/react', () => ({
      useQuery: () => undefined,
      useMutation: () => fn(),
    }))
  },
}
