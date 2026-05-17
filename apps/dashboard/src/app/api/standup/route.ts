import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'GOOGLE_GENERATIVE_AI_API_KEY not configured — add it to .env.local',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
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

  // Replace with this
  const result = await streamText({ model: google('gemini-2.0-flash-lite'), prompt })
  const encoder = new TextEncoder()
  // const readable = new ReadableStream({
  //   async start(controller) {
  //     for await (const chunk of result.textStream) {
  //       controller.enqueue(encoder.encode(chunk))
  //     }
  //     controller.close()
  //   },
  // })

  const readable = new ReadableStream({
    async start(controller) {
      let totalChunks = 0
      for await (const chunk of result.textStream) {
        console.log('chunk:', chunk)
        totalChunks++
        controller.enqueue(encoder.encode(chunk))
      }
      console.log('Stream done, total chunks:', totalChunks)
      controller.close()
    },
  })
  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
