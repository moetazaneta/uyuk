import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let mockHabits: any = undefined
let mockCompletions: any = []
let mockStats: any = null
let mockSettings: any = { weekStartDay: 'monday' }

vi.mock('convex/react', () => ({
  useQuery: (apiFn: unknown, args: any) => {
    if (args === 'skip') return undefined
    if (apiFn === 'mock_api_habits_list') return mockHabits
    if (apiFn === 'mock_api_completions_byDateRange') return mockCompletions
    if (apiFn === 'mock_api_stats_forHabit') return mockStats
    if (apiFn === 'mock_api_users_settings') return mockSettings
    return undefined
  },
}))

vi.mock('~/../convex/_generated/api', () => ({
  api: {
    habits: {
      list: 'mock_api_habits_list',
    },
    completions: {
      byDateRange: 'mock_api_completions_byDateRange',
    },
    stats: {
      forHabit: 'mock_api_stats_forHabit',
    },
    users: {
      settings: 'mock_api_users_settings',
    },
  },
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}))

import { GridsView } from './GridsView'

describe('GridsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHabits = undefined
    mockCompletions = []
    mockStats = null
    mockSettings = { weekStartDay: 'monday' }
  })

  it('shows loading skeleton when data is undefined', () => {
    render(<GridsView />)
    expect(screen.getByTestId('grids-loading')).toBeInTheDocument()
  })

  it('shows empty state when habits array is empty', () => {
    mockHabits = []
    render(<GridsView />)
    expect(screen.getByText(/No habits yet/i)).toBeInTheDocument()
    expect(screen.getByText(/\+ new habit/i)).toBeInTheDocument()
  })

  it('renders All Habits grid and combined view', () => {
    mockHabits = [
      {
        _id: 'habit_1',
        name: 'Drink Water',
        iconType: 'emoji',
        iconValue: '💧',
        color: '#00f',
        type: 'boolean',
        target: 1,
      },
    ]
    render(<GridsView />)
    expect(screen.getByTestId('grids-view')).toBeInTheDocument()
    expect(screen.getByText('All Habits')).toBeInTheDocument()
    expect(screen.getByText(/Drink Water/)).toBeInTheDocument()
  })

  it('renders habit stats if available', () => {
    mockHabits = [{ _id: 'h1', name: 'Read Pages', color: '#f00', target: 10 }]
    mockStats = { currentStreak: 5, completionRate: 85 }

    render(<GridsView />)
    expect(screen.getByText('5d streak • 85%')).toBeInTheDocument()
  })

  it('day of week headers follow weekStart preference (monday)', () => {
    mockHabits = [{ _id: 'h1', name: 'Run', color: '#0f0', target: 1 }]
    mockSettings = { weekStartDay: 'monday' }
    const { container } = render(<GridsView />)

    // We look at the first group of headers (from All Habits grid)
    const allHeaders = container.querySelectorAll('.text-\\[10px\\]')
    const first7 = Array.from(allHeaders)
      .slice(0, 7)
      .map((el) => el.textContent)

    expect(first7).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S'])
  })

  it('day of week headers follow weekStart preference (sunday)', () => {
    mockHabits = [{ _id: 'h1', name: 'Run', color: '#0f0', target: 1 }]
    mockSettings = { weekStartDay: 'sunday' }
    const { container } = render(<GridsView />)

    const allHeaders = container.querySelectorAll('.text-\\[10px\\]')
    const first7 = Array.from(allHeaders)
      .slice(0, 7)
      .map((el) => el.textContent)

    expect(first7).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S'])
  })
})
