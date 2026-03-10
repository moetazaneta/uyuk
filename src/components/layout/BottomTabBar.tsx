import { Link, useRouterState } from '@tanstack/react-router'
import PhGear from '~icons/ph/gear-six'
import PhGrid from '~icons/ph/grid-nine'
import PhList from '~icons/ph/list'

import { cn } from '../../lib/cn'

const navItems = [
  { path: '/table', label: 'table', icon: PhList },
  { path: '/grids', label: 'grids', icon: PhGrid },
  { path: '/settings', label: 'settings', icon: PhGear },
]

export function BottomTabBar() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const showLabel = false

  return (
    <div className="flex h-[calc(56px+env(safe-area-inset-bottom))] w-full pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.path)
        return (
          <Link
            key={item.path}
            to={item.path}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 transition-colors hover:bg-bg-elevated min-h-[56px] min-w-[56px]',
              isActive ? 'text-text-primary' : 'text-text-disabled',
            )}
          >
            <item.icon className="h-6 w-6" />
            {showLabel && (
              <span className="font-mono text-[10px] leading-none">
                {item.label}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
