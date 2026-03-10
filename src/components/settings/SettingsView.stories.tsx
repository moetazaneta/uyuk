import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { SettingsView } from './SettingsView'

const mockSettings = {
  _id: 'settings1',
  _creationTime: Date.now(),
  userId: 'user1',
  weekStartDay: 'monday',
  showStatsInTable: true,
  mobileTableViewDayCount: 7,
  timezone: 'America/New_York',
  name: 'Test User',
}

vi.mock('convex/react', () => ({
  useQuery: (query: unknown) => {
    const key = String(query)
    if (key.includes('settings')) return mockSettings
    if (key.includes('archived')) return []
    if (key.includes('deleted')) return []
    return undefined
  },
  useMutation: () => fn(),
}))

vi.mock('@convex-dev/auth/react', () => ({
  useAuthActions: () => ({ signOut: fn() }),
}))

const meta: Meta<typeof SettingsView> = {
  title: 'Settings/SettingsView',
  component: SettingsView,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SettingsView>

export const Default: Story = {}

export const WithArchivedAndDeleted: Story = {
  beforeEach() {
    const archivedHabit = {
      _id: 'habit-archived',
      _creationTime: Date.now(),
      userId: 'user1',
      name: 'Old habit',
      iconType: 'emoji',
      iconValue: '🎯',
      color: '#3b82f6',
      type: 'boolean',
      target: 1,
      sortOrder: 10,
      isArchived: true,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    const deletedHabit = {
      _id: 'habit-deleted',
      _creationTime: Date.now(),
      userId: 'user1',
      name: 'Deleted habit',
      iconType: 'emoji',
      iconValue: '🗑️',
      color: '#ef4444',
      type: 'boolean',
      target: 1,
      sortOrder: 11,
      isArchived: false,
      isDeleted: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    vi.mock('convex/react', () => ({
      useQuery: (query: unknown) => {
        const key = String(query)
        if (key.includes('settings')) return mockSettings
        if (key.includes('archived')) return [archivedHabit]
        if (key.includes('deleted')) return [deletedHabit]
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
