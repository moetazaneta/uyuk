import { AppShell } from '../components/layout/AppShell'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useConvexAuth } from 'convex/react'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

export function AuthenticatedLayout() {
  const { isLoading, isAuthenticated } = useConvexAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({ to: '/auth' })
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <span className="font-mono text-sm text-zinc-500">loading...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
