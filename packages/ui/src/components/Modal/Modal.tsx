import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@devpulse/utils'

export interface ModalProps {
  /** Controls visibility. Toggle this from the parent to open/close. */
  isOpen: boolean
  /** Called when the overlay is clicked or Escape is pressed. */
  onClose: () => void
  /** Displayed in the header. Also used as the accessible dialog label via aria-labelledby. */
  title: string
  /** Content rendered in the dialog body. */
  children: React.ReactNode
  className?: string
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const titleId = React.useId()
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = React.useState(false)

  // createPortal needs document — only available after first render.
  React.useEffect(() => { setMounted(true) }, [])

  // Scroll lock
  React.useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  // Focus management: trap tab cycle, handle Escape, restore focus on close.
  React.useEffect(() => {
    if (!isOpen) return

    const trigger = document.activeElement as HTMLElement | null

    function getFocusable() {
      if (!dialogRef.current) return []
      return Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      )
    }

    // Move focus into the dialog on open.
    const focusable = getFocusable()
    focusable[0]?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const items = getFocusable()
      const first = items[0]
      const last  = items[items.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      trigger?.focus()           // restore focus to the element that opened the modal
    }
  }, [isOpen, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        // Outer wrapper: fades the whole thing in/out
        <motion.div
          key="modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden
            onClick={onClose}
          />

          {/* Dialog panel: scale in on top of the overlay */}
          <motion.div
            ref={dialogRef}
            key="modal-panel"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1,    opacity: 1 }}
            exit={{ scale: 0.95,    opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="dialog"
            aria-modal
            aria-labelledby={titleId}
            className={cn(
              'relative w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900 shadow-2xl shadow-black/50',
              className,
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2
                id={titleId}
                className="text-base font-semibold text-gray-100"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-md p-1 text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
