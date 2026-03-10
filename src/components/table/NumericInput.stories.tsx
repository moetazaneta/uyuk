import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'

import { NumericInput } from './NumericInput'

const meta: Meta<typeof NumericInput> = {
  title: 'Table/NumericInput',
  component: NumericInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NumericInput>

export const Default: Story = {
  args: {
    initialValue: 0,
    onSave: fn(),
    onCancel: fn(),
  },
}

export const WithValue: Story = {
  args: {
    initialValue: 8,
    onSave: fn(),
    onCancel: fn(),
  },
}
