'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Modal, Input } from '@devpulse/ui'
import { createClient } from '@/lib/supabase/client'
import { useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTaskMutations'
import type { Task } from './TaskCard'

type TeamMember = { id: string; name: string }

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  columnId: string
  task?: Task
}

export function TaskModal({ isOpen, onClose, projectId, columnId, task }: TaskModalProps) {
  const mode = task ? 'edit' : 'create'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setTitle(task?.title ?? '')
    setDescription(task?.description ?? '')
    setAssigneeId(task?.assignee_id ?? '')
    setIsConfirmingDelete(false)
  }, [isOpen, task])

  const { data: members = [] } = useQuery<TeamMember[]>({
    queryKey: ['team-members'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('team_members')
        .select('id, name')
        .order('name')
      if (error) throw error
      return data as TeamMember[]
    },
  })

  const createTask = useCreateTask(projectId)
  const updateTask = useUpdateTask(projectId)
  const deleteTask = useDeleteTask(projectId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      assigneeId: assigneeId || null,
    }

    if (mode === 'create') {
      createTask.mutate({ columnId, ...payload })
    } else if (task) {
      updateTask.mutate({ taskId: task.id, ...payload })
    }
    onClose()
  }

  function handleConfirmDelete() {
    if (!task) return
    deleteTask.mutate({ taskId: task.id })
    onClose()
  }

  const isSaving = createTask.isPending || updateTask.isPending

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'New task' : 'Edit task'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
          autoFocus
        />

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Optional description…"
            className="block w-full resize-none rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500"
          />
        </div>

        {/* Assignee */}
        {members.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="block w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500"
            >
              <option value="">No assignee</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center border-t border-gray-200 dark:border-gray-800 pt-4">
          {isConfirmingDelete ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-400">Delete this task?</span>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="inline-flex h-8 items-center rounded-md border px-3 text-sm font-medium transition-colors border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="inline-flex h-8 items-center rounded-md bg-red-600 px-3 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <>
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="text-sm text-red-500 transition-colors hover:text-red-400"
                >
                  Delete task
                </button>
              )}
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-8 items-center rounded-md border px-3 text-sm font-medium transition-colors border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !title.trim()}
                  className="inline-flex h-8 items-center rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </Modal>
  )
}
