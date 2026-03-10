import type { Meta, StoryObj } from '@storybook/react'
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
    onSave: (v: number) => console.log('saved', v),
    onCancel: () => console.log('cancelled'),
  },
}

export const WithValue: Story = {
  args: {
    initialValue: 8,
    onSave: (v: number) => console.log('saved', v),
    onCancel: () => console.log('cancelled'),
  },
}
