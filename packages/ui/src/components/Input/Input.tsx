import * as React from 'react'
import { cn } from '@devpulse/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Text label rendered above the input and linked via `htmlFor`. */
  label?: string
  /** Error message shown below the input; also applies the error visual state. */
  error?: string
}

export function Input({
  label,
  error,
  id: idProp,
  disabled,
  className,
  ...props
}: InputProps) {
  const generatedId = React.useId()
  const id = idProp ?? generatedId
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-200"
        >
          {label}
        </label>
      )}

      <input
        {...props}
        id={id}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'block w-full rounded-md border px-3 py-2 text-sm',
          'bg-gray-900 text-gray-100 placeholder:text-gray-500',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      />

      {error && (
        <p id={errorId} className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
