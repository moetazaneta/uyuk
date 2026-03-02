import type { ReactNode } from 'react'

import { BottomTabBar } from './BottomTabBar'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-full bg-bg">
      {/* Desktop Sidebar */}
      <div className="hidden h-full w-[240px] shrink-0 md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Mobile Bottom Tab Bar */}
        <div className="block h-[56px] shrink-0 md:hidden">
          <BottomTabBar />
        </div>
      </div>
    </div>
  )
}
