import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardBody, Button, Badge } from '@devpulse/ui'

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    shadow:  { control: 'select', options: ['none', 'sm', 'md'] },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
  args: { padding: 'md', shadow: 'sm' },
  render: (args) => (
    <Card {...args}>
      <p className="text-sm text-gray-400">
        A flat card with uniform padding — ideal for simple content blocks
        that don't need a header separator.
      </p>
    </Card>
  ),
}

export const WithHeaderAndBody: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <h3 className="text-sm font-semibold text-gray-100">Deploy status</h3>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-gray-400">Last deploy succeeded 3 minutes ago.</p>
      </CardBody>
    </Card>
  ),
}

export const WithHeaderAction: Story = {
  name: 'Header with action button',
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-100">Open incidents</h3>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-gray-400">No active incidents right now.</p>
      </CardBody>
    </Card>
  ),
}

export const ShadowVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      {(['none', 'sm', 'md'] as const).map((s) => (
        <Card key={s} shadow={s} padding="md" className="w-40">
          <p className="text-xs text-gray-400 text-center">shadow="{s}"</p>
        </Card>
      ))}
    </div>
  ),
}

export const DashboardWidget: Story = {
  name: 'Dashboard stat card (realistic)',
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[640px]">
      {[
        { label: 'Deployments today', value: '12',  delta: '+3',  status: 'success' as const },
        { label: 'Open PRs',          value: '7',   delta: '+1',  status: 'warning' as const },
        { label: 'Failed builds',     value: '2',   delta: '-1',  status: 'danger'  as const },
      ].map((stat) => (
        <Card key={stat.label} shadow="sm">
          <CardBody>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
            <div className="mt-2">
              <Badge variant={stat.status}>{stat.delta} vs yesterday</Badge>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
}
