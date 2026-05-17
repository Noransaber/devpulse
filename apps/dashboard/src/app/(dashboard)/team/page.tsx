'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Modal, Input, Skeleton } from '@devpulse/ui'
import { cn } from '@devpulse/utils'
import { createClient } from '@/lib/supabase/client'
import { useTeamMembers, useAddMember, useDeleteMember, type TeamMember } from '@/hooks/useTeamMembers'
import { usePresenceStore } from '@/stores/presenceStore'

// ── Avatar helpers ────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-green-500',
  'bg-teal-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
]

function avatarColor(name: string) {
  return AVATAR_COLORS[(name.charCodeAt(0) ?? 0) % AVATAR_COLORS.length]!
}

function MemberAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-12 w-12 shrink-0 rounded-full object-cover"
      />
    )
  }
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white',
        avatarColor(name),
      )}
    >
      {initials}
    </span>
  )
}

// ── MemberCard ────────────────────────────────────────────────────────────────

interface MemberCardProps {
  member: TeamMember
  isOnline: boolean
  taskCount: number
  onDelete: (id: string) => void
}

function MemberCard({ member, isOnline, taskCount, onDelete }: MemberCardProps) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
      {/* Avatar + name + online dot */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <MemberAvatar name={member.name} avatarUrl={member.avatar_url} />
          {isOnline && (
            <span
              aria-label="Online"
              className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 bg-green-400"
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-900 dark:text-gray-100">{member.name}</p>
          <p className="text-xs text-gray-500">
            {taskCount === 0
              ? 'No tasks assigned'
              : taskCount === 1
              ? '1 task assigned'
              : `${taskCount} tasks assigned`}
          </p>
        </div>
      </div>

      {/* Remove / confirm row */}
      {confirming ? (
        <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Remove from team?</span>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium transition-colors border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onDelete(member.id)}
              className="inline-flex h-7 items-center rounded-md bg-red-600 px-2.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="self-start border-t border-gray-100 dark:border-gray-800 pt-3 text-xs text-gray-400 transition-colors hover:text-red-500 dark:hover:text-red-400 w-full text-left"
        >
          Remove member
        </button>
      )}
    </div>
  )
}

// ── Skeleton cards ────────────────────────────────────────────────────────────

function MemberCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
      <div className="flex items-center gap-3">
        <Skeleton height={48} width={48} className="rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton height={14} width={120} />
          <Skeleton height={11} width={88} />
        </div>
      </div>
      <Skeleton height={11} width={80} className="mt-1" />
    </div>
  )
}

// ── Add member modal ──────────────────────────────────────────────────────────

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const addMember = useAddMember()

  // Reset form whenever the modal closes, regardless of how it was closed
  useEffect(() => {
    if (!isOpen) {
      setName('')
      setAvatarUrl('')
    }
  }, [isOpen])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addMember.mutate(
      { name: name.trim(), avatarUrl: avatarUrl.trim() || null },
      { onSuccess: onClose },
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add team member">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          required
          autoFocus
        />
        <Input
          label="Avatar URL (optional)"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://…"
        />
        <div className="flex justify-end gap-2 border-t border-gray-200 dark:border-gray-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center rounded-md border px-3 text-sm font-medium transition-colors border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={addMember.isPending || !name.trim()}
            className="inline-flex h-8 items-center rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
          >
            {addMember.isPending ? 'Adding…' : 'Add member'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const { data: members = [], isLoading } = useTeamMembers()
  const { onlineUsers } = usePresenceStore()
  const deleteMember = useDeleteMember()
  const [isAddOpen, setIsAddOpen] = useState(false)

  const { data: taskCounts = {} } = useQuery<Record<string, number>>({
    queryKey: ['task-counts-by-assignee'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tasks')
        .select('assignee_id')
        .not('assignee_id', 'is', null)
      if (error) throw error
      const counts: Record<string, number> = {}
      for (const t of data) {
        if (t.assignee_id) {
          counts[t.assignee_id] = (counts[t.assignee_id] ?? 0) + 1
        }
      }
      return counts
    },
  })

  const onlineNames = new Set(onlineUsers.map((u) => u.name))

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Team</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? '' : `${members.length} member${members.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <span aria-hidden className="text-base leading-none">+</span>
          Add member
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <MemberCardSkeleton key={i} />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 py-16 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            No team members yet — add one above
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              isOnline={onlineNames.has(member.name)}
              taskCount={taskCounts[member.id] ?? 0}
              onDelete={(id) => deleteMember.mutate({ memberId: id })}
            />
          ))}
        </div>
      )}

      <AddMemberModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </main>
  )
}
