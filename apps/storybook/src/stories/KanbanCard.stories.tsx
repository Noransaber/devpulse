import type { Meta, StoryObj } from '@storybook/react'
import { KanbanCard } from '@devpulse/ui'

const meta = {
  title: 'UI/KanbanCard',
  component: KanbanCard,
  tags: ['autodocs'],
  argTypes: {
    priority: { control: 'select', options: ['low', 'medium', 'high'] },
  },
} satisfies Meta<typeof KanbanCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title:    'Fix authentication session timeout on mobile Safari',
    badge:    { label: 'Bug', variant: 'danger' },
    assignee: { name: 'Jane Doe', initials: 'JD' },
    priority: 'high',
  },
}

export const Priorities: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      <KanbanCard
        title="Update Node.js to v22 LTS"
        badge={{ label: 'Chore', variant: 'default' }}
        assignee={{ name: 'Raj Patel', initials: 'RP' }}
        priority="low"
      />
      <KanbanCard
        title="Add retry logic to the queue worker"
        badge={{ label: 'Improvement', variant: 'warning' }}
        assignee={{ name: 'Maya Kim', initials: 'MK' }}
        priority="medium"
      />
      <KanbanCard
        title="Fix authentication session timeout on mobile Safari"
        badge={{ label: 'Bug', variant: 'danger' }}
        assignee={{ name: 'Jane Doe', initials: 'JD' }}
        priority="high"
      />
    </div>
  ),
}

export const Unassigned: Story = {
  args: {
    title:    'Research WebSocket vs Server-Sent Events for real-time updates',
    badge:    { label: 'Research', variant: 'default' },
    priority: 'low',
  },
}

export const Interactive: Story = {
  args: {
    title:    'Set up Sentry error alerting for the API gateway',
    badge:    { label: 'Feature', variant: 'success' },
    assignee: { name: 'Alex Brown', initials: 'AB' },
    priority: 'medium',
    // eslint-disable-next-line no-console
    onClick: () => console.log('card clicked'),
  },
}

export const KanbanBoard: Story = {
  name: 'Kanban board (realistic)',
  render: () => {
    const columns = [
      {
        id: 'todo',
        label: 'To Do',
        cards: [
          {
            title: 'Write API docs for the metrics endpoint',
            badge: { label: 'Docs', variant: 'default' as const },
            assignee: { name: 'Raj Patel', initials: 'RP' },
            priority: 'low' as const,
          },
          {
            title: 'Research WebSocket vs SSE for real-time feed',
            badge: { label: 'Research', variant: 'default' as const },
            priority: 'medium' as const,
          },
        ],
      },
      {
        id: 'in-progress',
        label: 'In Progress',
        cards: [
          {
            title: 'Add retry logic to the deploy queue worker',
            badge: { label: 'Improvement', variant: 'warning' as const },
            assignee: { name: 'Maya Kim', initials: 'MK' },
            priority: 'medium' as const,
          },
          {
            title: 'Set up Sentry alerting for API gateway errors',
            badge: { label: 'Feature', variant: 'success' as const },
            assignee: { name: 'Alex Brown', initials: 'AB' },
            priority: 'high' as const,
          },
        ],
      },
      {
        id: 'done',
        label: 'Done',
        cards: [
          {
            title: 'Fix authentication session timeout on mobile Safari',
            badge: { label: 'Bug', variant: 'danger' as const },
            assignee: { name: 'Jane Doe', initials: 'JD' },
            priority: 'high' as const,
          },
          {
            title: 'Upgrade Turborepo to v2 and verify all pipelines',
            badge: { label: 'Chore', variant: 'default' as const },
            assignee: { name: 'Raj Patel', initials: 'RP' },
            priority: 'low' as const,
          },
        ],
      },
    ]

    return (
      <div className="grid grid-cols-3 gap-4 w-[760px]">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col gap-2">
            {/* Column header */}
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {col.label}
              </span>
              <span className="text-xs text-gray-600">{col.cards.length}</span>
            </div>

            {/* Cards */}
            {col.cards.map((card) => (
              <KanbanCard key={card.title} {...card} />
            ))}
          </div>
        ))}
      </div>
    )
  },
}
