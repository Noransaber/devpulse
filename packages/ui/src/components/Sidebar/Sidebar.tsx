import * as React from 'react'
import { cn } from '@devpulse/utils'

export interface SidebarLink {
  href: string
  label: string
  icon?: React.ReactNode
  isActive?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

export interface SidebarProps {
  links: SidebarLink[]
  brand?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Sidebar({ links, brand, footer, className }: SidebarProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className={cn(
        'flex h-full w-60 shrink-0 flex-col',
        'border-r border-gray-200 dark:border-gray-800',
        'bg-white dark:bg-gray-950',
        className,
      )}
    >
      {brand && (
        <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-5">
          {brand}
        </div>
      )}

      <ul className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={link.onClick}
              aria-current={link.isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                link.isActive
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-200',
              )}
            >
              {link.icon && (
                <span aria-hidden className="h-4 w-4 shrink-0">
                  {link.icon}
                </span>
              )}
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {footer && (
        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-4">
          {footer}
        </div>
      )}
    </nav>
  )
}
