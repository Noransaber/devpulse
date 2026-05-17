'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { Sidebar } from '@devpulse/ui'
import { usePresence } from '@/hooks/usePresence'
import { useTheme } from '@/hooks/useTheme'
import { usePresenceStore } from '@/stores/presenceStore'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Home' },
  { href: '/board',     label: 'Board' },
  { href: '/github',    label: 'GitHub' },
  { href: '/standup',   label: 'Standup' },
  { href: '/team',      label: 'Team' },
]

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  )
}

export function DashboardSidebar() {
  const pathname   = usePathname()
  const router     = useRouter()
  const { user }   = useUser()
  const { signOut } = useClerk()
  const { theme, toggle } = useTheme()
  const onlineUsers = usePresence()
  const { setOnlineUsers } = usePresenceStore()
  useEffect(() => { setOnlineUsers(onlineUsers) }, [onlineUsers, setOnlineUsers])

  const links = NAV_LINKS.map((link) => ({
    ...link,
    isActive: pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href)),
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      router.push(link.href)
    },
  }))

  const initials =
    [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('') || '?'
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.emailAddresses?.[0]?.emailAddress ||
    ''

  return (
    <Sidebar
      links={links}
      brand={
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
            D
          </span>
          <span className="text-sm font-bold tracking-wide text-gray-900 dark:text-gray-100">
            DevPulse
          </span>
        </div>
      }
      footer={
        <div className="flex flex-col gap-4">
          {/* Online presence */}
          {onlineUsers.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Online
              </p>
              {onlineUsers.map((u) => (
                <div key={u.userId} className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
                  <span className="truncate text-sm text-gray-700 dark:text-gray-300">
                    {u.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* User avatar + name + theme toggle */}
          <div className="flex items-center gap-2.5">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={displayName}
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-200">
                {initials}
              </span>
            )}
            <p className="flex-1 truncate text-sm font-medium text-gray-800 dark:text-gray-200">
              {displayName}
            </p>
            <button
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ redirectUrl: '/sign-in' })}
            className="w-full rounded-md px-3 py-1.5 text-left text-sm text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Sign out
          </button>
        </div>
      }
    />
  )
}
