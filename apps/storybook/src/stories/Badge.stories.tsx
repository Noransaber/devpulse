import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '@devpulse/ui'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'danger', 'default'],
    },
    dot: { control: 'boolean' },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Default', variant: 'default' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="default">Default</Badge>
    </div>
  ),
}

export const WithDot: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge variant="success" dot>Deployed</Badge>
      <Badge variant="warning" dot>Pending</Badge>
      <Badge variant="danger" dot>Failed</Badge>
      <Badge variant="default" dot>Idle</Badge>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      {[
        { name: 'API Gateway',   status: 'success' as const, label: 'Healthy' },
        { name: 'Auth Service',  status: 'warning' as const, label: 'Degraded' },
        { name: 'Queue Worker',  status: 'danger'  as const, label: 'Down' },
        { name: 'Cron Scheduler',status: 'default' as const, label: 'Idle' },
      ].map((row) => (
        <div key={row.name} className="flex items-center justify-between text-sm text-white">
          <span>{row.name}</span>
          <Badge variant={row.status} dot>{row.label}</Badge>
        </div>
      ))}
    </div>
  ),
}
