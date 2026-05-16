import { Skeleton } from '@devpulse/ui'

function SkeletonCard({ titleWidth }: { titleWidth: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <Skeleton height={14} width={titleWidth} />
    </div>
  )
}

const COLUMNS: { width: number; cards: string[] }[] = [
  { width: 72,  cards: ['85%', '70%', '90%'] },
  { width: 88,  cards: ['75%', '60%'] },
  { width: 56,  cards: ['80%'] },
]

export function KanbanSkeleton() {
  return (
    <div className="flex gap-5 p-6">
      {COLUMNS.map((col, colIndex) => (
        <div key={colIndex} className="flex w-72 shrink-0 flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <Skeleton height={13} width={col.width} />
            <Skeleton height={20} width={24} rounded />
          </div>

          <div className="flex min-h-48 flex-col gap-2 rounded-lg bg-gray-100 dark:bg-gray-900/30 p-2">
            {col.cards.map((w, cardIndex) => (
              <SkeletonCard key={cardIndex} titleWidth={w} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
