'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { KanbanCard } from '@devpulse/ui'

export type Task = {
  id: string
  column_id: string
  title: string
  description: string | null
  position: number
  assignee_id: string | null
  created_at: string
  updated_at: string
}

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      layout={!isDragging}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      animate={{ opacity: isDragging ? 0.4 : 1 }}
      {...attributes}
      {...listeners}
    >
      <KanbanCard title={task.title} />
    </motion.div>
  )
}
