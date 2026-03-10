import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'

import { RouterDecorator } from '../../../.storybook/preview'
import { HabitForm } from './HabitForm'

vi.mock('convex/react', () => ({
  useMutation: () => fn(),
  useQuery: () => undefined,
}))

const meta: Meta<typeof HabitForm> = {
  title: 'Habits/HabitForm',
  component: HabitForm,
  decorators: [RouterDecorator],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HabitForm>

export const CreateHabit: Story = {
  args: {
    onSuccess: fn(),
    onCancel: fn(),
  },
}

export const EditHabit: Story = {
  args: {
    habitId: 'k17abc123' as Parameters<typeof HabitForm>[0]['habitId'],
    initialValues: {
      name: 'Drink water',
      description: 'At least 2 liters',
      iconType: 'emoji',
      iconValue: '💧',
      color: '#3b82f6',
      type: 'numeric',
      target: 8,
    },
    onSuccess: fn(),
    onCancel: fn(),
  },
}
