import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Task } from '@/components/board/TaskCard'

// ── Create ───────────────────────────────────────────────────────────────────

type CreateVars = {
  columnId: string
  title: string
  description: string | null
  assigneeId: string | null
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['tasks', projectId]

  return useMutation<Task, Error, CreateVars, { previousTasks: Task[] | undefined }>({
    mutationFn: async ({ columnId, title, description, assigneeId }) => {
      const supabase = createClient()
      const { count } = await supabase
        .from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('column_id', columnId)
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          column_id: columnId,
          title,
          description,
          assignee_id: assigneeId,
          position: count ?? 0,
        })
        .select()
        .single()
      if (error) throw error
      return data as Task
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey })
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey)
      const existing = previousTasks ?? []
      const position = existing.filter((t) => t.column_id === vars.columnId).length
      const optimistic: Task = {
        id: `optimistic-${Date.now()}`,
        column_id: vars.columnId,
        title: vars.title,
        description: vars.description,
        assignee_id: vars.assigneeId,
        position,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      queryClient.setQueryData<Task[]>(queryKey, [...existing, optimistic])
      return { previousTasks }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks !== undefined) {
        queryClient.setQueryData(queryKey, context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

// ── Update ───────────────────────────────────────────────────────────────────

type UpdateVars = {
  taskId: string
  title: string
  description: string | null
  assigneeId: string | null
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['tasks', projectId]

  return useMutation<void, Error, UpdateVars, { previousTasks: Task[] | undefined }>({
    mutationFn: async ({ taskId, title, description, assigneeId }) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('tasks')
        .update({
          title,
          description,
          assignee_id: assigneeId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
      if (error) throw error
    },
    onMutate: async ({ taskId, title, description, assigneeId }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey)
      queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
        old.map((t) =>
          t.id === taskId
            ? { ...t, title, description, assignee_id: assigneeId, updated_at: new Date().toISOString() }
            : t,
        ),
      )
      return { previousTasks }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks !== undefined) {
        queryClient.setQueryData(queryKey, context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

// ── Delete ───────────────────────────────────────────────────────────────────

type DeleteVars = { taskId: string }

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['tasks', projectId]

  return useMutation<void, Error, DeleteVars, { previousTasks: Task[] | undefined }>({
    mutationFn: async ({ taskId }) => {
      const supabase = createClient()
      const { error } = await supabase.from('tasks').delete().eq('id', taskId)
      if (error) throw error
    },
    onMutate: async ({ taskId }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey)
      queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
        old.filter((t) => t.id !== taskId),
      )
      return { previousTasks }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks !== undefined) {
        queryClient.setQueryData(queryKey, context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
