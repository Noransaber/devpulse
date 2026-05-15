import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton, Card, CardBody } from '@devpulse/ui'

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    width:   { control: 'text' },
    height:  { control: 'text' },
    rounded: { control: 'boolean' },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { width: '100%', height: '1rem' },
}

export const Circle: Story = {
  args: { width: 40, height: 40, rounded: true },
}

export const TextBlock: Story = {
  name: 'Text lines (paragraph)',
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Skeleton height="0.875rem" width="60%" />
      <Skeleton height="0.875rem" />
      <Skeleton height="0.875rem" />
      <Skeleton height="0.875rem" width="75%" />
    </div>
  ),
}

export const DashboardWidgetLoading: Story = {
  name: 'Dashboard widget loading state',
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[640px]">
      {[0, 1, 2].map((i) => (
        <Card key={i} shadow="sm">
          <CardBody>
            {/* mirrors: <p className="text-xs text-gray-500 mb-1">{stat.label}</p> */}
            <Skeleton height="0.75rem" width="70%" className="mb-1" />

            {/* mirrors: <p className="text-2xl font-bold text-gray-100">{stat.value}</p> */}
            <Skeleton height="2rem" width="30%" />

            {/* mirrors: <Badge variant={stat.status}>{stat.delta} vs yesterday</Badge> */}
            <Skeleton height="1.25rem" width="8rem" rounded className="mt-2" />
          </CardBody>
        </Card>
      ))}
    </div>
  ),
}

export const CardSkeleton: Story = {
  name: 'Card loading state (realistic)',
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[520px]">
      {[0, 1].map((i) => (
        <Card key={i} shadow="sm">
          <CardBody>
            {/* avatar + name row */}
            <div className="flex items-center gap-3 mb-4">
              <Skeleton width={40} height={40} rounded />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton height="0.75rem" width="50%" />
                <Skeleton height="0.75rem" width="35%" />
              </div>
            </div>

            {/* stat value */}
            <Skeleton height="1.75rem" width="40%" className="mb-2" />

            {/* label lines */}
            <div className="flex flex-col gap-1.5">
              <Skeleton height="0.75rem" />
              <Skeleton height="0.75rem" width="80%" />
            </div>

            {/* badge placeholder */}
            <Skeleton height="1.25rem" width="5rem" rounded className="mt-3" />
          </CardBody>
        </Card>
      ))}
    </div>
  ),
}
