import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Sidebar, Badge, Card, CardBody, KanbanCard } from '@devpulse/ui'
import type { SidebarLink } from '@devpulse/ui'

const meta = {
  title: 'UI/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

// ─── shared icons ────────────────────────────────────────────────────────────

function IconGrid()     { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> }
function IconChart()    { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14"/></svg> }
function IconClipboard(){ return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> }
function IconUsers()    { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.478-3.764M17 20H7m10 0v-2c0-.768-.17-1.5-.478-2.153M7 20H2v-2a4 4 0 015.478-3.764M7 20v-2c0-.768.17-1.5.478-2.153M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg> }
function IconCog()      { return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> }

const NAV_LINKS: SidebarLink[] = [
  { href: '#',          label: 'Dashboard',  icon: <IconGrid />,      isActive: true  },
  { href: '#analytics', label: 'Analytics',  icon: <IconChart />                      },
  { href: '#projects',  label: 'Projects',   icon: <IconClipboard />                  },
  { href: '#team',      label: 'Team',       icon: <IconUsers />                      },
  { href: '#settings',  label: 'Settings',   icon: <IconCog />                        },
]

// ─── brand mark ──────────────────────────────────────────────────────────────

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
        D
      </span>
      <span className="text-sm font-semibold text-gray-100">DevPulse</span>
    </div>
  )
}

// ─── stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div className="h-64">
      <Sidebar links={NAV_LINKS} />
    </div>
  ),
}

export const WithBrand: Story = {
  render: () => (
    <div className="h-72">
      <Sidebar links={NAV_LINKS} brand={<Brand />} />
    </div>
  ),
}

export const ActiveStates: Story = {
  name: 'Active vs inactive links',
  render: () => (
    <div className="h-72 flex gap-8">
      <div>
        <p className="mb-2 px-2 text-xs text-gray-500">Dashboard active</p>
        <Sidebar links={NAV_LINKS} />
      </div>
      <div>
        <p className="mb-2 px-2 text-xs text-gray-500">Settings active</p>
        <Sidebar
          links={NAV_LINKS.map((l) => ({ ...l, isActive: l.href === '#settings' }))}
        />
      </div>
    </div>
  ),
}

export const DashboardLayout: Story = {
  name: 'Full dashboard layout (realistic)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar links={NAV_LINKS} brand={<Brand />} />

      <main className="flex flex-1 flex-col overflow-auto">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-gray-800 px-8 py-4">
          <h1 className="text-base font-semibold">Dashboard</h1>
          <Badge variant="success" dot>All systems operational</Badge>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-6 p-8">
          {/* Stat row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Deployments today', value: '12', delta: '+3',  status: 'success' as const },
              { label: 'Open PRs',          value: '7',  delta: '+1',  status: 'warning' as const },
              { label: 'Failed builds',     value: '2',  delta: '-1',  status: 'danger'  as const },
            ].map((s) => (
              <Card key={s.label} shadow="sm">
                <CardBody>
                  <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <div className="mt-2">
                    <Badge variant={s.status}>{s.delta} vs yesterday</Badge>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Kanban strip */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-3">Active tasks</h2>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {[
                { title: 'Fix auth session timeout', badge: { label: 'Bug', variant: 'danger' as const }, assignee: { name: 'Jane Doe', initials: 'JD' }, priority: 'high' as const },
                { title: 'Add retry logic to queue',  badge: { label: 'Feature', variant: 'success' as const }, assignee: { name: 'Alex Brown', initials: 'AB' }, priority: 'medium' as const },
                { title: 'Update Node.js to v22 LTS', badge: { label: 'Chore', variant: 'default' as const }, assignee: { name: 'Raj Patel', initials: 'RP' }, priority: 'low' as const },
              ].map((card) => (
                <div key={card.title} className="w-56 shrink-0">
                  <KanbanCard {...card} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  ),
}
