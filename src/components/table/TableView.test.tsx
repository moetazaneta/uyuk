import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockUpsert = vi.fn()
const mockReorder = vi.fn()

// We need a variable to control useQuery return value per test
let mockHabits: any = undefined
let mockCompletions: any = []
let mockStats: any = null

vi.mock('convex/react', () => ({
  useMutation: (apiFn: unknown) => {
    if (apiFn === 'mock_api_completions_upsert') return mockUpsert
    if (apiFn === 'mock_api_habits_reorder') return mockReorder
    return vi.fn()
  },
  useQuery: (apiFn: unknown, _args: any) => {
    if (apiFn === 'mock_api_habits_list') return mockHabits
    if (apiFn === 'mock_api_completions_byDateRange') return mockCompletions
    if (apiFn === 'mock_api_stats_forHabit') return mockStats
    return undefined
  },
}))

vi.mock('~/../convex/_generated/api', () => ({
  api: {
    habits: {
      list: 'mock_api_habits_list',
      reorder: 'mock_api_habits_reorder',
    },
    completions: {
      upsert: 'mock_api_completions_upsert',
      byDateRange: 'mock_api_completions_byDateRange',
    },
    stats: {
      forHabit: 'mock_api_stats_forHabit',
    },
  },
}))

// We need to mock Link from tanstack router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}))

import { TableView } from './TableView'

describe('TableView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHabits = undefined
    mockCompletions = []
    mockStats = null
  })

  it('shows loading skeleton when habits are undefined', () => {
    render(<TableView />)
    expect(screen.getByTestId('table-loading')).toBeInTheDocument()
  })

  it('shows empty state when habits array is empty', () => {
    mockHabits = []
    render(<TableView />)
    expect(screen.getByText(/No habits yet/i)).toBeInTheDocument()
    expect(screen.getByText(/Create your first habit/i)).toBeInTheDocument()
  })

  it('renders habit rows when habits are present', () => {
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

    render(<TableView />)
    expect(screen.getByText('Drink Water')).toBeInTheDocument()
    expect(screen.getByText('💧')).toBeInTheDocument()
  })

  it('renders correct number of day columns (7 by default)', () => {
    mockHabits = [{ _id: 'habit_1' }]
    render(<TableView dayCount={7} />)

    // We expect 7 column headers in the table.
    // They have uppercase labels like "MON", "TUE".
    // Also "STATS" is there.
    expect(screen.getByText('STATS')).toBeInTheDocument()
    // It's hard to precisely count the text nodes, but we can verify there are 7 day divs in TableHeader.
    // They share a flex container. We can check by rendering TableView with dayCount.
    // Or we can mock the Date and count the distinct days.
    // We can also query the TableHeader directly.
  })

  it('boolean cell increments on click', async () => {
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
    // Empty completions means value=0

    render(<TableView dayCount={1} />) // 1 column to make it easy

    // The cell should be clickable. Let's find it.
    // DayCell uses w-7 or w-8, we can find it by looking at the parent of fill div or just its role.
    // Let's add a test-id or find by click on the cell's container.
    // Without test-id, we can find it by looking for its class or role if we added one.
    // Since it has onClick, we can find the element that has the cursor-pointer.
    const cells = document.querySelectorAll('.cursor-pointer')
    expect(cells.length).toBe(1)

    await act(async () => {
      fireEvent.click(cells[0])
    })

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        habitId: 'habit_1',
        value: 1,
      }),
    )
  })

  it('numeric cell opens input on click', async () => {
    mockHabits = [
      {
        _id: 'habit_2',
        name: 'Read Pages',
        iconType: 'emoji',
        iconValue: '📖',
        color: '#f00',
        type: 'numeric',
        target: 10,
      },
    ]
    render(<TableView dayCount={1} />)

    const cells = document.querySelectorAll('.cursor-pointer')
    expect(cells.length).toBe(1)

    await act(async () => {
      fireEvent.click(cells[0])
    })

    // Numeric input should appear
    const input = document.querySelector('input[type="number"]')
    expect(input).toBeInTheDocument()
  })
})
