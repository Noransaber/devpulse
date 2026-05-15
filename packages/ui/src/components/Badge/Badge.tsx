import * as React from 'react'
import { cn } from '@devpulse/utils'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'default'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color scheme conveying status or category. Defaults to `default`. */
  variant?: BadgeVariant
  /**
   * When true, renders a small filled circle before the label —
   * useful for live status indicators.
   */
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger:  'bg-red-100   text-red-800',
  default: 'bg-gray-100  text-gray-700',
}

const dotClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger:  'bg-red-500',
  default: 'bg-gray-400',
}

export function Badge({
  variant = 'default',
  dot = false,
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden
          className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotClasses[variant])}
        />
      )}
      {children}
    </span>
  )
}
