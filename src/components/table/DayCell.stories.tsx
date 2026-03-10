import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'

import { DayCell } from './DayCell'

const meta: Meta<typeof DayCell> = {
  title: 'Table/DayCell',
  component: DayCell,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    habitColor: { control: 'color' },
    habitType: { control: 'select', options: ['boolean', 'numeric'] },
  },
}

export default meta
type Story = StoryObj<typeof DayCell>

export const EmptyBoolean: Story = {
  args: {
    date: '2026-03-10',
    isToday: false,
    value: 0,
    target: 1,
    habitType: 'boolean',
    habitColor: '#3b82f6',
    habitName: 'Exercise',
    onUpdate: fn(),
  },
}

export const CompletedBoolean: Story = {
  args: {
    date: '2026-03-10',
    isToday: false,
    value: 1,
    target: 1,
    habitType: 'boolean',
    habitColor: '#22c55e',
    habitName: 'Drink water',
    onUpdate: fn(),
  },
}

export const TodayEmpty: Story = {
  args: {
    date: '2026-03-10',
    isToday: true,
    value: 0,
    target: 1,
    habitType: 'boolean',
    habitColor: '#f97316',
    habitName: 'Run',
    onUpdate: fn(),
  },
}

export const NumericPartial: Story = {
  args: {
    date: '2026-03-10',
    isToday: false,
    value: 4,
    target: 8,
    habitType: 'numeric',
    habitColor: '#a855f7',
    habitName: 'Water glasses',
    onUpdate: fn(),
  },
}

export const NumericFull: Story = {
  args: {
    date: '2026-03-10',
    isToday: true,
    value: 8,
    target: 8,
    habitType: 'numeric',
    habitColor: '#ec4899',
    habitName: 'Water glasses',
    onUpdate: fn(),
  },
}
