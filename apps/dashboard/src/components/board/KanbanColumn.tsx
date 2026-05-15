'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@devpulse/utils'
import { TaskCard, type Task } from './TaskCard'

export type Column = {
  id: string
  project_id: string
  name: string
  position: number
  created_at: string
}

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-gray-300">{column.name}</h3>
        <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
          {tasks.length}
        </span>
      </div>

      {/* Task list — droppable + sortable area */}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={cn(
            'flex min-h-48 flex-1 flex-col gap-2 rounded-lg p-2 transition-colors',
            isOver ? 'bg-gray-800/60 ring-1 ring-gray-600' : 'bg-gray-900/30',
          )}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
