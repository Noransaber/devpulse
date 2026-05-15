import { KanbanBoard } from '@/components/board/KanbanBoard'

// Project ID from seed data — will come from URL params or user context in a real app
const PROJECT_ID = 'a0000000-0000-0000-0000-000000000001'

export default function BoardPage() {
  return <KanbanBoard projectId={PROJECT_ID} />
}
