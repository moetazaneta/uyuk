import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsView,
})

function SettingsView() {
  return (
    <div className="flex-1 p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4 font-mono text-text-primary">
        settings
      </h1>
      <div className="flex-1 bg-bg-elevated text-text-secondary flex items-center justify-center font-mono">
        settings placeholder
      </div>
    </div>
  )
}
