import { UserButton } from '@clerk/nextjs'
import { Sidebar } from '@devpulse/ui'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/board', label: 'Board' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar
        links={NAV_LINKS}
        brand={
          <span className="text-sm font-bold tracking-wide text-gray-100">
            DevPulse
          </span>
        }
        footer={<UserButton />}
      />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
