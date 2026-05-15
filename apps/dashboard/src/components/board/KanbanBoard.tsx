'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { KanbanCard } from '@devpulse/ui'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeTasks } from '@/hooks/useRealtimeTasks'
import { KanbanColumn, type Column } from './KanbanColumn'
import { TaskCard, type Task } from './TaskCard'

type MoveTaskVars = {
  taskId: string
  newColumnId: string
  newPosition: number
}

interface KanbanBoardProps {
  projectId: string
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const queryClient = useQueryClient()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  useRealtimeTasks(projectId)

  // Activate drag only after moving 5 px — prevents accidental drags on click
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  )

  // ── Queries ────────────────────────────────────────────────────────────────

  const { data: columns } = useQuery({
    queryKey: ['columns', projectId],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('columns')
        .select('*')
        .eq('project_id', projectId)
        .order('position')
      if (error) throw error
      return data as Column[]
    },
  })

  const columnIds = columns?.map((c) => c.id) ?? []

  // Tasks query is gated on columns loading first — we need column IDs to filter
  const { data: tasks } = useQuery({
    queryKey: ['tasks', projectId],
    enabled: columnIds.length > 0,
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .in('column_id', columnIds)
        .order('position')
      if (error) throw error
      return data as Task[]
    },
  })

  // ── Optimistic mutation ────────────────────────────────────────────────────

  const { mutate: moveTask } = useMutation<void, Error, MoveTaskVars, { previousTasks: Task[] | undefined }>({
    mutationFn: async ({ taskId, newColumnId, newPosition }) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('tasks')
        .update({
          column_id: newColumnId,
          position: newPosition,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
      if (error) throw error
    },

    // Runs synchronously before mutationFn. Rewrites the cache immediately so
    // the card appears in its new column before the server responds.
    onMutate: async ({ taskId, newColumnId, newPosition }) => {
      // Cancel any in-flight refetches for this query key. If a refetch landed
      // after our optimistic write, it would overwrite it with stale data.
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] })

      // Snapshot the cache before we touch it. This is our rollback value —
      // we return it so TanStack Query passes it to onError as `context`.
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', projectId])

      // Write the new state into the cache. The UI re-renders from this
      // immediately — the card jumps to its new column with no network wait.
      queryClient.setQueryData<Task[]>(['tasks', projectId], (old = []) =>
        old.map((task) =>
          task.id === taskId
            ? { ...task, column_id: newColumnId, position: newPosition }
            : task,
        ),
      )

      return { previousTasks }
    },

    // Runs only if mutationFn threw. Restores the snapshot so the card
    // animates back to where it was before the drag.
    onError: (_err, _vars, context) => {
      if (context?.previousTasks !== undefined) {
        queryClient.setQueryData(['tasks', projectId], context.previousTasks)
      }
    },

    // Runs after mutationFn resolves or rejects — always. Re-fetches from the
    // server so the cache reflects the true database state whether the update
    // succeeded or the rollback already ran.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
    },
  })

  // ── Drag handlers ──────────────────────────────────────────────────────────

  function onDragStart({ active }: DragStartEvent) {
    setActiveTask(tasks?.find((t) => t.id === active.id) ?? null)
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null)
    if (!over || !tasks) return

    const taskId = active.id as string
    const overId = over.id as string

    // The card can land on another task card or directly on a column background
    const overColumn = columns?.find((c) => c.id === overId)
    const overTask = tasks.find((t) => t.id === overId)
    const newColumnId = overColumn?.id ?? overTask?.column_id
    if (!newColumnId) return

    // Place the card after the task it landed on, or at the end of the column
    const siblings = tasks
      .filter((t) => t.column_id === newColumnId && t.id !== taskId)
      .sort((a, b) => a.position - b.position)

    const overIndex = overTask ? siblings.findIndex((t) => t.id === overTask.id) : -1
    const newPosition = overIndex >= 0 ? overIndex + 1 : siblings.length

    moveTask({ taskId, newColumnId, newPosition })
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!columns || !tasks) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        Loading board…
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-5 overflow-x-auto p-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasks
              .filter((t) => t.column_id === column.id)
              .sort((a, b) => a.position - b.position)}
          />
        ))}
      </div>

      {/* Renders a floating copy of the card that follows the cursor during drag.
          The original card stays in place at 40 % opacity (set in TaskCard). */}
      <DragOverlay>
        {activeTask && (
          <motion.div
            initial={{ scale: 1.03, rotate: 1 }}
            className="cursor-grabbing drop-shadow-xl"
          >
            <KanbanCard title={activeTask.title} />
          </motion.div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
