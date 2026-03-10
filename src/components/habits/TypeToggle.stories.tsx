import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { TypeToggle } from './TypeToggle'

const meta: Meta<typeof TypeToggle> = {
  title: 'Habits/TypeToggle',
  component: TypeToggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TypeToggle>

function Controlled(props: { initial?: 'boolean' | 'numeric' }) {
  const [value, setValue] = useState<'boolean' | 'numeric'>(
    props.initial ?? 'boolean',
  )
  return (
    <div className="w-64">
      <TypeToggle value={value} onChange={setValue} />
    </div>
  )
}

export const BooleanType: Story = {
  render: () => <Controlled initial="boolean" />,
}

export const NumericType: Story = {
  render: () => <Controlled initial="numeric" />,
}
