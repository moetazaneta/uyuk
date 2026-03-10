import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { IconPicker } from './IconPicker'
import type { IconPickerProps } from './IconPicker'

const meta: Meta<typeof IconPicker> = {
  title: 'Habits/IconPicker',
  component: IconPicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof IconPicker>

function Controlled(props: { initial?: IconPickerProps['value'] }) {
  const [value, setValue] = useState<IconPickerProps['value']>(
    props.initial ?? { type: 'emoji', value: '🎯' },
  )
  return <IconPicker value={value} onChange={setValue} />
}

export const EmojiTab: Story = {
  render: () => <Controlled />,
}

export const IconTab: Story = {
  render: () => <Controlled initial={{ type: 'icon', value: 'Activity' }} />,
}
