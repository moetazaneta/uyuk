import type { Meta, StoryObj } from '@storybook/react'
import { RouterDecorator } from '../../../.storybook/preview'
import { AppShell } from './AppShell'

const meta: Meta<typeof AppShell> = {
  title: 'Layout/AppShell',
  component: AppShell,
  decorators: [RouterDecorator],
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AppShell>

export const Default: Story = {
  args: {
    children: (
      <div className="p-6 text-text-primary font-mono text-sm">
        Main content area
      </div>
    ),
  },
}
