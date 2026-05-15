import * as React from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Meta, StoryObj } from '@storybook/react'
import { Toast, Button } from '@devpulse/ui'

const meta = {
  title: 'UI/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    type:    { control: 'select', options: ['success', 'error', 'info'] },
    message: { control: 'text' },
  },
  // Wrap every story in AnimatePresence so exit animations work in autodocs too
  decorators: [
    (Story) => (
      <AnimatePresence>
        <Story />
      </AnimatePresence>
    ),
  ],
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: {
    type:    'success',
    message: 'Deployment to production succeeded in 12 s.',
  },
}

export const Error: Story = {
  args: {
    type:    'error',
    message: 'Build failed — 3 TypeScript errors in src/api.ts.',
  },
}

export const Info: Story = {
  args: {
    type:    'info',
    message: 'A new release of DevPulse is available.',
  },
}

export const WithDismiss: Story = {
  args: {
    type:      'success',
    message:   'Changes saved.',
    onDismiss: () => {},
  },
}

export const Animated: Story = {
  name: 'Animated — enter / exit (interactive)',
  render: () => {
    const [toasts, setToasts] = React.useState<
      { id: number; type: 'success' | 'error' | 'info'; message: string }[]
    >([])
    const nextId = React.useRef(0)

    function add(type: 'success' | 'error' | 'info', message: string) {
      const id = nextId.current++
      setToasts((prev) => [...prev, { id, type, message }])
      // auto-dismiss after 3 s
      setTimeout(() => dismiss(id), 3000)
    }

    function dismiss(id: number) {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }

    return (
      <div className="flex flex-col gap-6">
        {/* trigger buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => add('success', 'Deployment succeeded.')}
          >
            Show success
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => add('error', 'Build failed — check logs.')}
          >
            Show error
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => add('info', 'New release available.')}
          >
            Show info
          </Button>
        </div>

        {/* toast stack — AnimatePresence tracks mount/unmount for exit animation */}
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {toasts.map((t) => (
              <Toast
                key={t.id}
                type={t.type}
                message={t.message}
                onDismiss={() => dismiss(t.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    )
  },
}
