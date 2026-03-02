import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { HabitModal } from '../../components/habits/HabitModal'
import { TableView as TableViewComponent } from '../../components/table/TableView'

export const Route = createFileRoute('/_authenticated/table')({
  component: TableView,
})

function TableView() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex-1 p-6 h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold font-mono text-text-primary">
          table
        </h1>
      </div>

      <div className="flex-1 bg-bg-elevated flex flex-col relative overflow-hidden border border-divider">
        <TableViewComponent dayCount={7} />
      </div>

      <HabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
