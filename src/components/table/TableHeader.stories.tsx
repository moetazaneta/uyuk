import type { Meta, StoryObj } from '@storybook/react'

import { TableHeader } from './TableHeader'

const meta: Meta<typeof TableHeader> = {
  title: 'Table/TableHeader',
  component: TableHeader,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TableHeader>

const today = new Date()
const dates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today.getTime() - (6 - i) * 86400000)
  const isToday = i === 6
  return {
    dateStr: d.toISOString().slice(0, 10),
    label: d.toLocaleDateString('en-US', { weekday: 'short' }),
    dayOfMonth: d.getDate().toString(),
    isToday,
  }
})

export const Default: Story = {
  args: { dates, showStats: false },
}

export const WithStats: Story = {
  args: { dates, showStats: true },
}
