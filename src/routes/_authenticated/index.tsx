import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated/')({
  component: Home,
})

function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    void navigate({ to: '/table', replace: true })
  }, [navigate])

  return null
}
