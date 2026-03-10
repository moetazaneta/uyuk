import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ColorPicker } from './ColorPicker'

const meta: Meta<typeof ColorPicker> = {
  title: 'Habits/ColorPicker',
  component: ColorPicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ColorPicker>

function Controlled(props: { initial?: string }) {
  const [value, setValue] = useState(props.initial ?? '#3b82f6')
  return <ColorPicker value={value} onChange={setValue} />
}

export const Default: Story = {
  render: () => <Controlled />,
}

export const WithCustomColor: Story = {
  render: () => <Controlled initial="#a855f7" />,
}
