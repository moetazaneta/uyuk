import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/grids')({
  component: GridsView,
})

function GridsView() {
  return (
    <div className="flex-1 p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4 font-mono text-text-primary">
        grids
      </h1>
      <div className="flex-1 bg-bg-elevated text-text-secondary flex items-center justify-center font-mono">
        grids view placeholder
      </div>
    </div>
  )
}
