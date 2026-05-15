import * as React from 'react'
import { cn } from '@devpulse/utils'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'
type CardShadow  = 'none' | 'sm' | 'md'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /**
   * Uniform padding applied to the entire card.
   * Use `none` (default) when composing with `CardHeader` / `CardBody`,
   * which manage their own padding.
   */
  padding?: CardPadding
  /** Drop-shadow depth. Defaults to `none`. */
  shadow?: CardShadow
}

export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-6',
}

const shadowClasses: Record<CardShadow, string> = {
  none: '',
  sm:   'shadow-sm shadow-black/20',
  md:   'shadow-md shadow-black/30',
}

export function Card({
  padding = 'none',
  shadow = 'none',
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-lg border border-gray-800 bg-gray-900 overflow-hidden',
        paddingClasses[padding],
        shadowClasses[shadow],
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: CardSectionProps) {
  return (
    <div
      {...props}
      className={cn(
        'px-5 py-4 border-b border-gray-800',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardBody({ children, className, ...props }: CardSectionProps) {
  return (
    <div
      {...props}
      className={cn('p-5', className)}
    >
      {children}
    </div>
  )
}
