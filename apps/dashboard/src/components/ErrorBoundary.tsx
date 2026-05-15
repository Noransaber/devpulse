'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorBoundary({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
        <span className="text-red-400 text-xl">!</span>
      </div>
      <h2 className="text-xl font-semibold text-gray-100">Something went wrong</h2>
      <p className="text-gray-400 max-w-md text-sm">
        {error.message || 'An unexpected error occurred. Our team has been notified.'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-medium"
      >
        Try again
      </button>
    </div>
  )
}
