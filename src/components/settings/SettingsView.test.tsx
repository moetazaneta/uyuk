import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockUpdateSettings = vi.fn()
const mockUpdateDisplayName = vi.fn()
const mockUnarchive = vi.fn()
const mockRestore = vi.fn()

let mockSettings: any = undefined
let mockArchivedHabits: any = undefined
let mockDeletedHabits: any = undefined

const mockSignOut = vi.fn()

vi.mock('@convex-dev/auth/react', () => ({
  useAuthActions: () => ({ signOut: mockSignOut }),
}))

vi.mock('convex/react', () => ({
  useMutation: (apiFn: string) => {
    if (apiFn === 'mock_api_users_updateSettings') return mockUpdateSettings
    if (apiFn === 'mock_api_users_updateDisplayName') return mockUpdateDisplayName
    if (apiFn === 'mock_api_habits_unarchive') return mockUnarchive
    if (apiFn === 'mock_api_habits_restore') return mockRestore
    return vi.fn()
  },
  useQuery: (apiFn: string) => {
    if (apiFn === 'mock_api_users_settings') return mockSettings
    if (apiFn === 'mock_api_habits_archived') return mockArchivedHabits
    if (apiFn === 'mock_api_habits_deleted') return mockDeletedHabits
    return undefined
  },
}))

vi.mock('~/../convex/_generated/api', () => ({
  api: {
    users: {
      settings: 'mock_api_users_settings',
      updateSettings: 'mock_api_users_updateSettings',
      updateDisplayName: 'mock_api_users_updateDisplayName',
    },
    habits: {
      archived: 'mock_api_habits_archived',
      deleted: 'mock_api_habits_deleted',
      unarchive: 'mock_api_habits_unarchive',
      restore: 'mock_api_habits_restore',
    },
  },
}))

import { SettingsView } from './SettingsView'

describe('SettingsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSettings = {
      name: 'Test User',
      timezone: 'America/Los_Angeles',
      weekStartDay: 'monday',
      tableViewDayCount: 7,
    }
    mockArchivedHabits = []
    mockDeletedHabits = []
    
    // Mock window.confirm
    window.confirm = vi.fn(() => true)
  })

  it('renders loading skeleton while settings load', () => {
    mockSettings = undefined
    render(<SettingsView />)
    expect(screen.getByTestId('settings-loading')).toBeInTheDocument()
  })

  it('renders all sections when data loads', () => {
    render(<SettingsView />)
    expect(screen.getByTestId('settings-view')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument()
    expect(screen.getByText('Monday ▾')).toBeInTheDocument()
    expect(screen.getByText('Sunday ▾')).toBeInTheDocument()
    expect(screen.getByText('no archived habits')).toBeInTheDocument()
    expect(screen.getByText('no deleted habits')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('week start toggle calls updateSettings', async () => {
    render(<SettingsView />)
    
    const sundayBtn = screen.getByText('Sunday ▾')
    await act(async () => {
      fireEvent.click(sundayBtn)
    })
    
    expect(mockUpdateSettings).toHaveBeenCalledWith({ weekStartDay: 'sunday' })
  })

  it('timezone select renders current timezone', () => {
    render(<SettingsView />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('America/Los_Angeles')
  })

  it('archived habits list renders unarchive button', async () => {
    mockArchivedHabits = [
      {
        _id: 'habit_1',
        name: 'Drink Water',
        iconType: 'emoji',
        iconValue: '💧',
        target: 1,
        color: '#0000ff',
      },
    ]
    render(<SettingsView />)
    
    expect(screen.getByText('Drink Water')).toBeInTheDocument()
    const unarchiveBtn = screen.getByRole('button', { name: /unarchive/i })
    
    await act(async () => {
      fireEvent.click(unarchiveBtn)
    })
    
    expect(mockUnarchive).toHaveBeenCalledWith({ id: 'habit_1' })
  })

  it('deleted habits list renders restore button', async () => {
    mockDeletedHabits = [
      {
        _id: 'habit_2',
        name: 'Read Book',
        iconType: 'emoji',
        iconValue: '📚',
        target: 1,
        color: '#00ff00',
      },
    ]
    render(<SettingsView />)
    
    expect(screen.getByText('Read Book')).toBeInTheDocument()
    const restoreBtn = screen.getByRole('button', { name: /restore/i })
    
    await act(async () => {
      fireEvent.click(restoreBtn)
    })
    
    expect(mockRestore).toHaveBeenCalledWith({ id: 'habit_2' })
  })
})
