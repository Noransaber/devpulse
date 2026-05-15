import * as React from 'react'
import { cn } from '@devpulse/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the placeholder. Accepts any CSS value (`"100%"`, `"120px"`)
   * or a bare number which is treated as pixels. Defaults to `"100%"`.
   */
  width?: string | number
  /**
   * Height of the placeholder. Accepts any CSS value or a bare number
   * treated as pixels. Defaults to `"1rem"`.
   */
  height?: string | number
  /**
   * When `true`, renders as a perfect circle — useful for avatar placeholders.
   * When `false` (default), renders with `rounded-md`.
   */
  rounded?: boolean
}

function toCss(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  rounded = false,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden
      className={cn(
        'animate-pulse bg-gray-700/60',
        rounded ? 'rounded-full' : 'rounded-md',
        className,
      )}
      style={{ width: toCss(width), height: toCss(height), ...style }}
    />
  )
}
