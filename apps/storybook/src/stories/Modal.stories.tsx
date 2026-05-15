import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Modal, Button, Input } from '@devpulse/ui'

const meta = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    // Modals use createPortal → they render outside the story canvas wrapper.
    // Turning off the default padding lets the overlay fill the preview correctly.
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

// ─── helper: every modal story needs its own toggle state ────────────────────

function ModalDemo({
  title,
  triggerLabel = 'Open modal',
  children,
}: {
  title: string
  triggerLabel?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex h-64 items-center justify-center">
      <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title={title}>
        {children}
      </Modal>
    </div>
  )
}

// ─── stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <ModalDemo title="Confirm action">
      <p className="text-sm text-gray-400">
        Are you sure you want to archive this repository? This action can be
        undone later from your settings.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Archive
        </Button>
      </div>
    </ModalDemo>
  ),
}

export const WithForm: Story = {
  render: () => (
    <ModalDemo title="Invite teammate" triggerLabel="Invite teammate">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input label="Full name" placeholder="Jane Doe" />
        <Input label="Work email" type="email" placeholder="jane@company.com" />
        <div className="flex justify-end gap-2 mt-1">
          <Button variant="secondary" size="sm" type="button">
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Send invite
          </Button>
        </div>
      </form>
    </ModalDemo>
  ),
}

export const Destructive: Story = {
  render: () => (
    <ModalDemo title="Delete project" triggerLabel="Delete project">
      <p className="text-sm text-gray-400 mb-1">
        This will permanently delete{' '}
        <span className="font-semibold text-gray-200">devpulse-prod</span> and
        all of its data. This cannot be undone.
      </p>
      <Input
        label='Type "devpulse-prod" to confirm'
        placeholder="devpulse-prod"
        className="mt-3"
      />
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Button
          size="sm"
          className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600"
        >
          Delete project
        </Button>
      </div>
    </ModalDemo>
  ),
}
