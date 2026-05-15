import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'OPENAI_API_KEY not configured — add it to .env.local' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const supabase = createClient()
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('title, description, columns!inner(name)')
    .eq('columns.name', 'Done')
    .gte('updated_at', since)
    .order('updated_at', { ascending: false })

  if (error) throw error

  const taskList = tasks
    .map((t) => `- ${t.title}${t.description ? `: ${t.description}` : ''}`)
    .join('\n')

  const prompt =
    tasks.length === 0
      ? 'No tasks were completed in the last 24 hours. Write a brief standup noting that.'
      : `You are an engineering team assistant. Based on the following tasks completed in the last 24 hours, write a concise daily standup in the first person. Use 2–4 short bullet points. Be specific and professional.

Completed tasks:
${taskList}

Write the standup:`

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    prompt,
  })

  return result.toDataStreamResponse()
}
