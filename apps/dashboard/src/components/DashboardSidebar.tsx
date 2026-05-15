'use client'

import { UserButton } from '@clerk/nextjs'
import { Sidebar } from '@devpulse/ui'
import { usePresence } from '@/hooks/usePresence'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/board', label: 'Board' },
  { href: '/github', label: 'GitHub' },
  { href: '/standup', label: 'Standup' },
]

export function DashboardSidebar() {
  const onlineUsers = usePresence()

  return (
    <Sidebar
      links={NAV_LINKS}
      brand={
        <span className="text-sm font-bold tracking-wide text-gray-100">
          DevPulse
        </span>
      }
      footer={
        <div className="flex flex-col gap-4">
          {onlineUsers.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Online
              </p>
              {onlineUsers.map((u) => (
                <div key={u.userId} className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
                  <span className="truncate text-sm text-gray-300">{u.name}</span>
                </div>
              ))}
            </div>
          )}
          <UserButton />
        </div>
      }
    />
  )
}
