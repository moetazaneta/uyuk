import type { Meta, StoryObj } from '@storybook/react'

import { GridCell } from './GridCell'

const meta: Meta<typeof GridCell> = {
  title: 'Grids/GridCell',
  component: GridCell,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
  },
}

export default meta
type Story = StoryObj<typeof GridCell>

export const Empty: Story = {
  args: {
    value: 0,
    target: 1,
    color: '#3b82f6',
    habitName: 'Exercise',
    dateStr: '2026-03-10',
    className: 'w-8 h-8',
  },
}

export const Quarter: Story = {
  args: {
    value: 1,
    target: 4,
    color: '#22c55e',
    habitName: 'Drink water',
    dateStr: '2026-03-10',
    className: 'w-8 h-8',
  },
}

export const Half: Story = {
  args: {
    value: 2,
    target: 4,
    color: '#f97316',
    habitName: 'Read',
    dateStr: '2026-03-10',
    className: 'w-8 h-8',
  },
}

export const Full: Story = {
  args: {
    value: 4,
    target: 4,
    color: '#a855f7',
    habitName: 'Meditate',
    dateStr: '2026-03-10',
    className: 'w-8 h-8',
  },
}
