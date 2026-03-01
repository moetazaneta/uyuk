import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: Home,
})

function Home() {
  return (
    <div>
      <h1>uyuk</h1>
      <p>habit tracker</p>
    </div>
  )
}
