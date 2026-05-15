import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@devpulse/utils'

type ToastType = 'success' | 'error' | 'info'

export interface ToastProps {
  /** Visual style and icon determined by the notification's intent. */
  type: ToastType
  /** The notification text. */
  message: string
  /**
   * Called when the user clicks the dismiss button.
   * If omitted, no dismiss button is rendered.
   */
  onDismiss?: () => void
  className?: string
}

const borderColor: Record<ToastType, string> = {
  success: 'border-l-green-500',
  error:   'border-l-red-500',
  info:    'border-l-blue-500',
}

const iconColor: Record<ToastType, string> = {
  success: 'text-green-400',
  error:   'text-red-400',
  info:    'text-blue-400',
}

function ToastIcon({ type }: { type: ToastType }) {
  if (type === 'success') {
    return (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )
  }
  if (type === 'error') {
    return (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  }
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
    </svg>
  )
}

/**
 * Animated toast notification. Wrap in <AnimatePresence> in the parent
 * so the exit animation fires when the component unmounts:
 *
 *   <AnimatePresence>
 *     {visible && <Toast type="success" message="Done!" onDismiss={hide} />}
 *   </AnimatePresence>
 */
export function Toast({ type, message, onDismiss, className }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 w-80 rounded-lg border border-gray-800 border-l-4 bg-gray-900 p-4 shadow-lg shadow-black/30',
        borderColor[type],
        className,
      )}
    >
      <span className={iconColor[type]}>
        <ToastIcon type={type} />
      </span>

      <p className="flex-1 text-sm text-gray-200 leading-snug">{message}</p>

      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.div>
  )
}
