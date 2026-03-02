import { Link, useRouterState } from '@tanstack/react-router'

import { GridsIcon, SettingsIcon, TableIcon } from './Icons'

const navItems = [
  { path: '/table', label: 'table', icon: TableIcon },
  { path: '/grids', label: 'grids', icon: GridsIcon },
  { path: '/settings', label: 'settings', icon: SettingsIcon },
]

export function BottomTabBar() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  return (
    <div className="flex h-[56px] w-full bg-bg-elevated">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.path)
        return (
          <Link
            key={item.path}
            to={item.path}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors min-h-[56px] min-w-[56px] ${
              isActive ? 'text-text-primary' : 'text-text-disabled'
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="font-mono text-[10px] leading-none">
              {item.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
