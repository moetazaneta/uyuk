import { Link, useRouterState } from '@tanstack/react-router'

import PhGear from '~icons/ph/gear'
import PhGridFour from '~icons/ph/grid-four'
import PhTable from '~icons/ph/table'

const navItems = [
  { path: '/table', label: 'table', icon: PhTable },
  { path: '/grids', label: 'grids', icon: PhGridFour },
  { path: '/settings', label: 'settings', icon: PhGear },
]

export function BottomTabBar() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  return (
    <div className="flex h-[calc(56px+env(safe-area-inset-bottom))] w-full bg-bg-elevated pb-[env(safe-area-inset-bottom)]">
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
