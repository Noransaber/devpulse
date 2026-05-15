import * as React from 'react'
import { cn } from '@devpulse/utils'

type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** URL of the profile image. Falls back to initials (or icon) if omitted or fails to load. */
  src?: string
  /** Alt text for the image. Provide a real name — e.g. "Jane Doe". */
  alt?: string
  /**
   * Up to two characters displayed when no image is available (e.g. `"JD"`).
   * The background colour is derived from the first character automatically.
   */
  initials?: string
  /** Size preset controlling width, height, and font size. Defaults to `md`. */
  size?: AvatarSize
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

/**
 * Full class strings must appear literally in source so Tailwind includes them.
 * Dynamic string interpolation (e.g. `bg-${color}-500`) would be purged at build time.
 */
const INITIALS_BG = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-pink-500',
  'bg-slate-500',
]

function pickColor(seed: string): string {
  const idx = seed.toUpperCase().charCodeAt(0) % INITIALS_BG.length
  return INITIALS_BG[idx] ?? 'bg-slate-500'
}

function FallbackIcon() {
  return (
    <svg
      className="h-1/2 w-1/2 text-white"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  )
}

export function Avatar({
  src,
  alt = '',
  initials,
  size = 'md',
  className,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false)

  const showImage = src && !imgError
  const bgColor = initials ? pickColor(initials) : 'bg-slate-400'

  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none font-medium',
        sizeClasses[size],
        !showImage && bgColor,
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : initials ? (
        <span aria-label={alt || initials} className="text-white leading-none">
          {initials.slice(0, 2).toUpperCase()}
        </span>
      ) : (
        <FallbackIcon />
      )}
    </span>
  )
}
