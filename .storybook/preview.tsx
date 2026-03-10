import type { Preview } from '@storybook/react'
import {
  RouterProvider,
  createRouter,
  createMemoryHistory,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import '../src/styles/app.css'

// Minimal router so components using useRouterState / Link don't crash
const rootRoute = createRootRoute({ component: () => null })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/' })
const tableRoute = createRoute({ getParentRoute: () => rootRoute, path: '/table' })
const gridsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/grids' })
const settingsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings' })
const habitNewRoute = createRoute({ getParentRoute: () => rootRoute, path: '/habits/new' })

const routeTree = rootRoute.addChildren([
  indexRoute,
  tableRoute,
  gridsRoute,
  settingsRoute,
  habitNewRoute,
])

const memoryHistory = createMemoryHistory({ initialEntries: ['/table'] })

const router = createRouter({ routeTree, history: memoryHistory })

export const RouterDecorator = (Story: () => ReactNode) => (
  <RouterProvider router={router} defaultComponent={() => <Story />} />
)

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
