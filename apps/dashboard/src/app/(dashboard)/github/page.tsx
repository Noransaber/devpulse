'use client'

import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@devpulse/ui'

interface Commit {
  message: string
  author: { name: string; date: string }
}

interface RepoStats {
  repository: {
    stargazerCount: number
    forkCount: number
    openIssues: { totalCount: number }
    openPRs: { totalCount: number }
    defaultBranchRef: {
      target: { history: { nodes: Commit[] } }
    } | null
  } | null
}

async function fetchGitHubStats(): Promise<RepoStats> {
  const res = await fetch('/api/github')
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `GitHub API error ${res.status}`)
  }
  return res.json() as Promise<RepoStats>
}

export default function GitHubPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['github-stats'],
    queryFn: fetchGitHubStats,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
        <div className="flex flex-col gap-2">
          <Skeleton height={28} width={120} />
          <Skeleton height={14} width={180} />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
            >
              <Skeleton height={32} width={48} />
              <Skeleton height={12} width={56} />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3"
            >
              <Skeleton height={14} width="75%" />
              <Skeleton height={12} width="40%" />
            </div>
          ))}
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-red-400">
        {error.message}
      </div>
    )
  }

  const repo = data?.repository
  if (!repo) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        Repository not found.
      </div>
    )
  }

  const commits = repo.defaultBranchRef?.target?.history?.nodes ?? []

  const stats = [
    { label: 'Stars',       value: repo.stargazerCount },
    { label: 'Forks',       value: repo.forkCount },
    { label: 'Open PRs',    value: repo.openPRs.totalCount },
    { label: 'Open Issues', value: repo.openIssues.totalCount },
  ]

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">GitHub</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Noransaber / devpulse</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center"
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            <p className="mt-1 text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
          Recent Commits
        </h2>
        {commits.length === 0 ? (
          <p className="text-sm text-gray-500">No commits found.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {commits.map((commit, i) => (
              <li
                key={i}
                className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3"
              >
                <p className="line-clamp-2 text-sm leading-snug text-gray-900 dark:text-gray-100">
                  {commit.message.split('\n')[0]}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {commit.author.name} · {new Date(commit.author.date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
