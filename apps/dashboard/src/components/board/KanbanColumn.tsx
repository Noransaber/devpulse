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
  onAddTask: (columnId: string) => void
  onEditTask: (task: Task) => void
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <line x1="6" y1="2" x2="6" y2="10" />
      <line x1="2" y1="6" x2="10" y2="6" />
    </svg>
  )
}

export function KanbanColumn({ column, tasks, onAddTask, onEditTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {column.name}
        </h3>
        <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
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
            isOver
              ? 'bg-gray-200/60 dark:bg-gray-800/60 ring-1 ring-gray-300 dark:ring-gray-600'
              : 'bg-gray-100 dark:bg-gray-900/30',
          )}
        >
          {tasks.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-1.5 py-8 text-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-gray-300 dark:text-gray-700"
                aria-hidden
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                No tasks yet — add one below
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} />
            ))
          )}
        </div>
      </SortableContext>

      {/* Add task button */}
      <button
        onClick={() => onAddTask(column.id)}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  )
}
