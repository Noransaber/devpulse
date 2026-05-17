'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import Link from 'next/link'

function HamburgerIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile top bar — hidden on desktop */}
      <header className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 h-14 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
              D
            </span>
            <span className="text-sm font-bold tracking-wide text-gray-900 dark:text-gray-100">
              DevPulse
            </span>
          </Link>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <HamburgerIcon />
        </button>
      </header>

      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* pt-20 on mobile offsets the fixed top bar; md:pt-8 restores the original spacing */}
      <main className="flex-1 overflow-y-auto p-8 pt-20 md:pt-8">{children}</main>
    </div>
  )
}
