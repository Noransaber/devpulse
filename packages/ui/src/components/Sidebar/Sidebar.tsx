import * as React from 'react'
import { cn } from '@devpulse/utils'

export interface SidebarLink {
  /** Destination URL. */
  href: string
  /** Text label for the nav item. */
  label: string
  /** Icon node — any SVG or icon-library element sized to ~1rem works here. */
  icon?: React.ReactNode
  /** Highlights this link as the current page. Sets aria-current="page". */
  isActive?: boolean
  /** Intercept navigation (e.g. to use a router's push instead of full reload). */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

export interface SidebarProps {
  /** Ordered list of navigation links. */
  links: SidebarLink[]
  /**
   * Content rendered in the header area above the links.
   * Typically a logo mark or product name.
   */
  brand?: React.ReactNode
  /** Content pinned to the bottom of the sidebar. Pass <UserButton /> here. */
  footer?: React.ReactNode
  className?: string
}

export function Sidebar({ links, brand, footer, className }: SidebarProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className={cn(
        'flex h-full w-60 shrink-0 flex-col border-r border-gray-800 bg-gray-950',
        className,
      )}
    >
      {/* Brand area */}
      {brand && (
        <div className="border-b border-gray-800 px-4 py-5">
          {brand}
        </div>
      )}

      {/* Nav links */}
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
                  ? 'bg-gray-800 text-gray-100'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200',
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

      {/* Footer slot — e.g. <UserButton /> */}
      {footer && (
        <div className="border-t border-gray-800 px-4 py-4">
          {footer}
        </div>
      )}
    </nav>
  )
}
