import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'

import { HabitModal } from './HabitModal'

vi.mock('convex/react', () => ({
  useMutation: () => fn(),
  useQuery: () => undefined,
}))

const meta: Meta<typeof HabitModal> = {
  title: 'Habits/HabitModal',
  component: HabitModal,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HabitModal>

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: fn(),
    onSuccess: fn(),
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: fn(),
  },
}
