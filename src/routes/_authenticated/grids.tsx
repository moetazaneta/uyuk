import { createFileRoute } from '@tanstack/react-router'
import { GridsView } from '~/components/grids/GridsView'

export const Route = createFileRoute('/_authenticated/grids')({
  component: GridsView,
})

