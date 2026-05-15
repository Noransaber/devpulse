'use client'

import { useQuery } from '@tanstack/react-query'
import { useCompletion } from '@ai-sdk/react'
import { createClient } from '@/lib/supabase/client'

type CompletedTask = {
  id: string
  title: string
  description: string | null
}

async function fetchCompletedTasks(): Promise<CompletedTask[]> {
  const supabase = createClient()
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('tasks')
    .select('id, title, description, columns!inner(name)')
    .eq('columns.name', 'Done')
    .gte('updated_at', since)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as CompletedTask[]
}

export default function StandupPage() {
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['standup-tasks'],
    queryFn: fetchCompletedTasks,
  })

  const { complete, completion, isLoading: generating, error } = useCompletion({
    api: '/api/standup',
  })

  const missingKey = error?.message?.includes('OPENAI_API_KEY')

  return (
    <main className="mx-auto max-w-2xl p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Daily Standup</h1>
        <p className="mt-1 text-sm text-gray-400">Tasks completed in the last 24 hours</p>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
          Completed
        </h2>
        {tasksLoading ? (
          <p className="text-sm text-gray-500">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-gray-500">No tasks completed in the last 24 hours.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3"
              >
                <p className="text-sm font-medium text-gray-100">{task.title}</p>
                {task.description && (
                  <p className="mt-0.5 text-xs text-gray-500">{task.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => complete('')}
        disabled={generating}
        className="self-start rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {generating ? 'Generating…' : 'Generate Standup'}
      </button>

      {missingKey && (
        <p className="text-sm text-amber-400">
          OpenAI API key not configured — add{' '}
          <code className="font-mono">OPENAI_API_KEY</code> to .env.local
        </p>
      )}

      {!missingKey && error && (
        <p className="text-sm text-red-400">{error.message}</p>
      )}

      {completion && (
        <div className="rounded-lg border border-gray-800 bg-gray-900 px-5 py-4">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
            Standup
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-100">
            {completion}
          </p>
        </div>
      )}
    </main>
  )
}
