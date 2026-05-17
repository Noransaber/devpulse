'use client'

import { cn } from '@devpulse/utils'
import { useBoardFilterStore } from '@/stores/boardFilterStore'
import { useTeamMembers } from '@/hooks/useTeamMembers'
import type { Column } from './KanbanColumn'

const SELECT_CLASS = cn(
  'h-9 rounded-md border px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
  'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900',
  'text-gray-900 dark:text-gray-100 focus:border-blue-500',
)

interface BoardToolbarProps {
  columns: Column[]
}

export function BoardToolbar({ columns }: BoardToolbarProps) {
  const { search, assigneeId, columnId, setSearch, setAssigneeId, setColumnId, reset } =
    useBoardFilterStore()
  const { data: members = [] } = useTeamMembers()

  const isFiltered = search !== '' || assigneeId !== null || columnId !== null

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-3">
      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks…"
        className={cn(
          SELECT_CLASS,
          'w-52 placeholder:text-gray-400 dark:placeholder:text-gray-500',
        )}
      />

      {/* Assignee */}
      <select
        value={assigneeId ?? ''}
        onChange={(e) => setAssigneeId(e.target.value || null)}
        className={SELECT_CLASS}
        aria-label="Filter by assignee"
      >
        <option value="">All assignees</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      {/* Column */}
      <select
        value={columnId ?? ''}
        onChange={(e) => setColumnId(e.target.value || null)}
        className={SELECT_CLASS}
        aria-label="Filter by column"
      >
        <option value="">All columns</option>
        {columns.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Clear */}
      {isFiltered && (
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium transition-colors border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
