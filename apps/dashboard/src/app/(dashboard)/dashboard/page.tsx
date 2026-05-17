'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Skeleton } from '@devpulse/ui'
import { formatRelativeTime } from '@devpulse/utils'
import { useHomeStats } from '@/hooks/useHomeStats'

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        {value ?? '—'}
      </p>
    </div>
  )
}

function BoardIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
      <rect x="2"  y="3" width="4" height="14" rx="1" />
      <rect x="8"  y="3" width="4" height="10" rx="1" />
      <rect x="14" y="3" width="4" height="12" rx="1" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M6.5 6.5L3 10l3.5 3.5M13.5 6.5L17 10l-3.5 3.5M11 5l-2 10" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400 dark:text-gray-600 transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-400" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

function FeatureCard({
  href,
  title,
  description,
  icon,
}: {
  href: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 transition-colors hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <div className="flex items-center justify-between text-gray-400">
        {icon}
        <ArrowRightIcon />
      </div>
      <div>
        <p className="font-medium text-gray-800 dark:text-gray-200">{title}</p>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
    </Link>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { user } = useUser()
  const { totalTasks, inProgress, doneToday, recentTasks, isLoading } = useHomeStats()

  const firstName = user?.firstName ?? 'there'
  const hour = new Date().getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 p-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Good {timeOfDay}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here&apos;s what&apos;s happening with your team today.
        </p>
      </div>

      {/* Quick stats */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
          Overview
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
                <Skeleton height={12} width="55%" />
                <Skeleton height={32} width="35%" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Tasks"  value={totalTasks} />
            <StatCard label="In Progress"  value={inProgress} />
            <StatCard label="Done Today"   value={doneToday} />
          </div>
        )}
      </section>

      {/* Feature cards */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
          Navigate
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FeatureCard
            href="/board"
            title="Board"
            description="Manage tasks and track progress"
            icon={<BoardIcon />}
          />
          <FeatureCard
            href="/github"
            title="GitHub"
            description="View PRs, issues, and commits"
            icon={<CodeIcon />}
          />
          <FeatureCard
            href="/standup"
            title="Standup"
            description="Generate your daily standup"
            icon={<ChatIcon />}
          />
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
          Recent Activity
        </h2>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3"
              >
                <Skeleton height={14} width="45%" />
                <div className="ml-auto flex gap-3">
                  <Skeleton height={12} width={72} />
                  <Skeleton height={12} width={56} />
                </div>
              </div>
            ))}
          </div>
        ) : recentTasks.length === 0 ? (
          <p className="text-sm text-gray-500">No activity yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {recentTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3"
              >
                <p className="truncate text-sm text-gray-800 dark:text-gray-200">{task.title}</p>
                <div className="ml-auto flex shrink-0 items-center gap-4">
                  {task.columns?.[0]?.name && (
                    <span className="text-xs text-gray-500">{task.columns[0].name}</span>
                  )}
                  <span className="text-xs text-gray-400 dark:text-gray-600">
                    {formatRelativeTime(new Date(task.updated_at))}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
