import * as React from 'react'
import { cn } from '@devpulse/utils'
import { Badge } from '../Badge/Badge'
import { Avatar } from '../Avatar/Avatar'
import type { BadgeProps } from '../Badge/Badge'

type Priority = 'low' | 'medium' | 'high'

export interface KanbanCardProps {
  /** Task title. Truncated after two lines. */
  title: string
  /**
   * Optional status or category label rendered at the top of the card.
   * Passes directly to Badge so all Badge variants are available.
   */
  badge?: { label: string; variant?: BadgeProps['variant'] }
  /** Assigned team member. Renders an Avatar (sm) + display name. */
  assignee?: { name: string; initials: string; src?: string }
  /**
   * Priority level. Controls the left-border accent colour:
   * low → gray, medium → yellow, high → red.
   */
  priority?: Priority
  /**
   * When provided the card becomes interactive — it receives
   * role="button", tabIndex, and keyboard (Enter / Space) support.
   */
  onClick?: () => void
  className?: string
}

// Full class strings must be literal so Tailwind includes them at build time.
const priorityBorder: Record<Priority, string> = {
  low:    'border-l-gray-600',
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
        'flex flex-col gap-3 rounded-lg border border-gray-800 bg-gray-900 p-4 shadow-sm',
        'transition-colors',
        priority && ['border-l-4', priorityBorder[priority]],
        interactive && 'cursor-pointer hover:border-gray-700 hover:bg-gray-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
        className,
      )}
    >
      {/* Badge row */}
      {badge && (
        <div>
          <Badge variant={badge.variant ?? 'default'}>{badge.label}</Badge>
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium text-gray-100 leading-snug line-clamp-2">
        {title}
      </p>

      {/* Assignee row */}
      {assignee && (
        <div className="flex items-center gap-2 mt-auto">
          <Avatar
            {...(assignee.src !== undefined ? { src: assignee.src } : {})}
            initials={assignee.initials}
            alt={assignee.name}
            size="sm"
          />
          <span className="text-xs text-gray-400 truncate">{assignee.name}</span>
        </div>
      )}
    </div>
  )
}
