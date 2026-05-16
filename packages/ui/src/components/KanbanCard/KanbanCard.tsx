import * as React from 'react'
import { cn } from '@devpulse/utils'
import { Badge } from '../Badge/Badge'
import { Avatar } from '../Avatar/Avatar'
import type { BadgeProps } from '../Badge/Badge'

type Priority = 'low' | 'medium' | 'high'

export interface KanbanCardProps {
  title: string
  badge?: { label: string; variant?: BadgeProps['variant'] }
  assignee?: { name: string; initials: string; src?: string }
  priority?: Priority
  onClick?: () => void
  className?: string
}

const priorityBorder: Record<Priority, string> = {
  low:    'border-l-gray-400 dark:border-l-gray-600',
  medium: 'border-l-yellow-500',
  high:   'border-l-red-500',
}

export function KanbanCard({
  title,
  badge,
  assignee,
  priority,
  onClick,
  className,
}: KanbanCardProps) {
  const interactive = onClick !== undefined

  function handleKeyDown(e: React.KeyboardEvent) {
    if (interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex flex-col gap-3 rounded-lg p-4 shadow-sm',
        'border border-gray-200 dark:border-gray-800',
        'bg-white dark:bg-gray-900',
        'transition-colors',
        priority && ['border-l-4', priorityBorder[priority]],
        interactive && [
          'cursor-pointer',
          'hover:border-gray-300 dark:hover:border-gray-700',
          'hover:bg-gray-50 dark:hover:bg-gray-800/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950',
        ],
        className,
      )}
    >
      {badge && (
        <div>
          <Badge variant={badge.variant ?? 'default'}>{badge.label}</Badge>
        </div>
      )}

      <p className="text-sm font-medium leading-snug line-clamp-2 text-gray-900 dark:text-gray-100">
        {title}
      </p>

      {assignee && (
        <div className="flex items-center gap-2 mt-auto">
          <Avatar
            {...(assignee.src !== undefined ? { src: assignee.src } : {})}
            initials={assignee.initials}
            alt={assignee.name}
            size="sm"
          />
          <span className="text-xs truncate text-gray-500 dark:text-gray-400">
            {assignee.name}
          </span>
        </div>
      )}
    </div>
  )
}
