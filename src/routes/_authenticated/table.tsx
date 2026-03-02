import { createFileRoute } from '@tanstack/react-router'

import { TableView } from '../../components/table/TableView'

export const Route = createFileRoute('/_authenticated/table')({
  component: TableView,
})
