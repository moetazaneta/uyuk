import { Link, useRouterState } from '@tanstack/react-router'

import { GridsIcon, SettingsIcon, TableIcon } from './Icons'

const navItems = [
  { path: '/table', label: 'table', icon: TableIcon },
  { path: '/grids', label: 'grids', icon: GridsIcon },
  { path: '/settings', label: 'settings', icon: SettingsIcon },
]

export function Sidebar() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  return (
    <div className="flex h-full w-[240px] flex-col bg-bg-elevated py-6">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 transition-colors ${
                isActive
                  ? 'bg-bg-subtle border-l-2 border-focus text-text-primary'
                  : 'border-l-2 border-transparent text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="font-mono text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
