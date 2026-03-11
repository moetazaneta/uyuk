import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { api } from '../../../convex/_generated/api'
import { TableView } from '../../components/table/TableView'

export const Route = createFileRoute('/_authenticated/table')({
  loader: async (opts) => {
    await Promise.all([
      opts.context.queryClient.ensureQueryData(convexQuery(api.users.settings)),
      opts.context.queryClient.ensureQueryData(convexQuery(api.habits.list)),
    ])
  },
  component: TableView,
})
