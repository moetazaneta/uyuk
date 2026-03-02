import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockCreate = vi.fn()
const mockUpdate = vi.fn()

vi.mock('convex/react', () => ({
  useMutation: (apiFn: unknown) => {
    if (apiFn === 'mock_api_habits_create') return mockCreate
    if (apiFn === 'mock_api_habits_update') return mockUpdate
    return vi.fn()
  },
  useQuery: vi.fn(),
}))

vi.mock('../../../convex/_generated/api', () => ({
  api: {
    habits: {
      create: 'mock_api_habits_create',
      update: 'mock_api_habits_update',
    },
  },
}))

import type { Id } from '../../../convex/_generated/dataModel'
import { HabitForm } from './HabitForm'

describe('HabitForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with empty form in create mode', () => {
    render(<HabitForm />)

    expect(screen.getByLabelText(/name/i)).toHaveValue('')
    expect(screen.getByLabelText(/description/i)).toHaveValue('')
    expect(
      screen.getByRole('button', { name: /create habit/i }),
    ).toBeInTheDocument()
  })

  it('shows validation error when name is empty', async () => {
    render(<HabitForm />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create habit/i }))
    })

    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('shows validation error when target is 0 or negative', async () => {
    render(<HabitForm />)

    // Switch to numeric
    fireEvent.click(screen.getByRole('button', { name: 'Numeric' }))

    const targetInput = await screen.findByLabelText(/target/i)
    fireEvent.change(targetInput, { target: { value: '0' } })

    // Fill name to pass its validation
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test' },
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /create habit/i }))
    })

    expect(
      await screen.findByText(/Target.*(must be > 0|is required)/i),
    ).toBeInTheDocument()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('calls create mutation with correct args on valid submit', async () => {
    render(<HabitForm />)

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test Habit' },
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create habit/i }))
    })

    expect(mockCreate).toHaveBeenCalledWith({
      name: 'Test Habit',
      description: undefined,
      iconType: 'emoji',
      iconValue: '🎯',
      color: '#3b82f6',
      type: 'boolean',
      target: 1,
    })
  })

  it('pre-fills fields in edit mode', () => {
    render(
      <HabitForm
        habitId={'test_id' as Id<'habits'>}
        initialValues={{
          name: 'Editing Habit',
          description: 'A description',
          type: 'numeric',
          target: 5,
        }}
      />,
    )

    expect(screen.getByLabelText(/name/i)).toHaveValue('Editing Habit')
    expect(screen.getByLabelText(/description/i)).toHaveValue('A description')
    expect(screen.getByLabelText(/target/i)).toHaveValue(5)
    expect(
      screen.getByRole('button', { name: /save changes/i }),
    ).toBeInTheDocument()
  })

  it('calls update mutation on edit submit', async () => {
    render(
      <HabitForm
        habitId={'test_id' as Id<'habits'>}
        initialValues={{
          name: 'Editing Habit',
        }}
      />,
    )

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    })

    expect(mockUpdate).toHaveBeenCalledWith({
      id: 'test_id',
      name: 'Editing Habit',
      description: undefined,
      iconType: 'emoji',
      iconValue: '🎯',
      color: '#3b82f6',
      type: 'boolean',
      target: 1,
    })
  })
})
