import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useConvexAuth } from 'convex/react'
import { Suspense, useEffect } from 'react'

import { AppShell } from '../components/layout/AppShell'

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <span className="font-mono text-sm text-zinc-500">
          not authenticated
        </span>
      </div>
    )
  }

  return (
    <AppShell>
      <Suspense fallback={<div>suspensing...</div>}>
        <Outlet />
      </Suspense>
    </AppShell>
  )
}
