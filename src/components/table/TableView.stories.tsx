import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'

import { RouterDecorator } from '../../../.storybook/preview'
import { TableView } from './TableView'

const today = new Date()
today.setHours(0, 0, 0, 0)

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
  {
    _id: 'habit3',
    _creationTime: Date.now(),
    userId: 'user1',
    name: 'Read',
    iconType: 'emoji',
    iconValue: '📚',
    color: '#a855f7',
    type: 'boolean',
    target: 1,
    sortOrder: 2,
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

const mockCompletions = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today.getTime() - (6 - i) * 86400000)
  const date = d.toISOString().slice(0, 10)
  return [
    { habitId: 'habit1', date, value: i % 3 === 0 ? 8 : 4 },
    { habitId: 'habit2', date, value: i % 2 === 0 ? 1 : 0 },
  ]
}).flat()

vi.mock('convex/react', () => ({
  useQuery: (query: unknown) => {
    const key = String(query)
    if (key.includes('settings')) return mockSettings
    if (key.includes('habits.list')) return mockHabits
    if (key.includes('completions')) return mockCompletions
    if (key.includes('stats')) return { currentStreak: 3, completionRate: 71 }
    return undefined
  },
  useMutation: () => fn(),
}))

const meta: Meta<typeof TableView> = {
  title: 'Table/TableView',
  component: TableView,
  decorators: [RouterDecorator],
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TableView>

export const Default: Story = {
  args: { dayCount: 7 },
}

export const WithStats: Story = {
  beforeEach() {
    vi.mock('convex/react', () => ({
      useQuery: (query: unknown) => {
        const key = String(query)
        if (key.includes('settings'))
          return { ...mockSettings, showStatsInTable: true }
        if (key.includes('habits.list')) return mockHabits
        if (key.includes('completions')) return mockCompletions
        if (key.includes('stats'))
          return { currentStreak: 3, completionRate: 71 }
        return undefined
      },
      useMutation: () => fn(),
    }))
  },
  args: { dayCount: 7 },
}

export const Empty: Story = {
  beforeEach() {
    vi.mock('convex/react', () => ({
      useQuery: (query: unknown) => {
        const key = String(query)
        if (key.includes('settings')) return mockSettings
        if (key.includes('habits.list')) return []
        if (key.includes('completions')) return []
        return undefined
      },
      useMutation: () => fn(),
    }))
  },
  args: { dayCount: 7 },
}

export const Loading: Story = {
  beforeEach() {
    vi.mock('convex/react', () => ({
      useQuery: () => undefined,
      useMutation: () => fn(),
    }))
  },
  args: { dayCount: 7 },
}
