import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

import { TableView } from '../../components/table/TableView'

export const Route = createFileRoute('/_authenticated/table')({
  component: TablePage,
})

export function TablePage() {
  return (
    <Suspense>
      <TableView />
    </Suspense>
  )
}
