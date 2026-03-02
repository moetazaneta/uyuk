import { createFileRoute, Link } from '@tanstack/react-router'
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
        {/* Desktop Create Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="hidden md:flex items-center justify-center h-8 px-4 bg-[#ededed] text-[#0a0a0a] hover:bg-[#d4d4d4] transition-colors font-sans text-sm font-medium"
        >
          + New Habit
        </button>
      </div>

      <div className="flex-1 bg-bg-elevated flex flex-col relative overflow-hidden border border-divider">
        <TableViewComponent dayCount={7} />
      </div>

      {/* Mobile Floating Action Button */}
      <Link
        to="/habits/new"
        className="md:hidden fixed bottom-20 right-6 w-[44px] h-[44px] bg-[#ededed] text-[#0a0a0a] flex items-center justify-center text-2xl hover:scale-105 transition-transform z-40 shadow-xl"
        aria-label="Create new habit"
      >
        +
      </Link>

      <HabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
