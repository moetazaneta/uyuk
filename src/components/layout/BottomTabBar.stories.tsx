import type { Meta, StoryObj } from '@storybook/react'

import { RouterDecorator } from '../../../.storybook/preview'
import { BottomTabBar } from './BottomTabBar'

const meta: Meta<typeof BottomTabBar> = {
  title: 'Layout/BottomTabBar',
  component: BottomTabBar,
  decorators: [RouterDecorator],
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BottomTabBar>

export const Default: Story = {}
