import type React from 'react'
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocks must be declared before the imports they affect (vitest hoists vi.mock calls)
vi.mock('@convex-dev/auth/react', () => ({
  useAuthActions: () => ({ signIn: vi.fn() }),
}))

const mockUseConvexAuth = vi.fn()
vi.mock('convex/react', () => ({
  useConvexAuth: () => mockUseConvexAuth(),
}))

const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => () => ({}),
  Outlet: () => <div data-testid="outlet" />,
  useNavigate: () => mockNavigate,
  useRouterState: () => ({ location: { pathname: '/table' } }),
  Link: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) =>
    <a href={to} className={className}>{children}</a>,
}))

import { AuthenticatedLayout } from './_authenticated'
import { AuthPage } from './auth'

describe('AuthPage', () => {
  it('renders the app name', () => {
    render(<AuthPage />)
    expect(screen.getByRole('heading', { name: /uyuk/i })).toBeInTheDocument()
  })

  it('renders the Google sign-in button', () => {
    render(<AuthPage />)
    expect(
      screen.getByRole('button', { name: /sign in with google/i }),
    ).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<AuthPage />)
    expect(screen.getByText(/habit tracker/i)).toBeInTheDocument()
  })
})

describe('AuthenticatedLayout', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
  })

  it('shows loading indicator while auth is loading', () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
    })
    render(<AuthenticatedLayout />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders outlet when authenticated', () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
    })
    render(<AuthenticatedLayout />)
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('renders nothing (null) while redirecting when not authenticated', () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
    })
    const { container } = render(<AuthenticatedLayout />)
    expect(container).toBeEmptyDOMElement()
  })

  it('navigates to /auth when not authenticated', async () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
    })
    await act(async () => {
      render(<AuthenticatedLayout />)
    })
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/auth' })
  })
})
