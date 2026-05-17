import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface TeamMember {
  id: string
  clerk_user_id: string | null
  name: string
  avatar_url: string | null
  created_at: string
}

const QUERY_KEY = ['team_members']

// ── Fetch ────────────────────────────────────────────────────────────────────

export function useTeamMembers() {
  return useQuery<TeamMember[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at')
      if (error) throw error
      return data as TeamMember[]
    },
  })
}

// ── Add ──────────────────────────────────────────────────────────────────────

type AddVars = {
  name: string
  avatarUrl: string | null
}

export function useAddMember() {
  const queryClient = useQueryClient()

  return useMutation<TeamMember, Error, AddVars, { previous: TeamMember[] | undefined }>({
    mutationFn: async ({ name, avatarUrl }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('team_members')
        .insert({ name, avatar_url: avatarUrl, clerk_user_id: null })
        .select()
        .single()
      if (error) throw error
      return data as TeamMember
    },
    onMutate: async ({ name, avatarUrl }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous = queryClient.getQueryData<TeamMember[]>(QUERY_KEY)
      const optimistic: TeamMember = {
        id: `optimistic-${Date.now()}`,
        clerk_user_id: null,
        name,
        avatar_url: avatarUrl,
        created_at: new Date().toISOString(),
      }
      queryClient.setQueryData<TeamMember[]>(QUERY_KEY, [...(previous ?? []), optimistic])
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

// ── Delete ───────────────────────────────────────────────────────────────────

type DeleteVars = { memberId: string }

export function useDeleteMember() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, DeleteVars, { previous: TeamMember[] | undefined }>({
    mutationFn: async ({ memberId }) => {
      const supabase = createClient()
      const { error } = await supabase.from('team_members').delete().eq('id', memberId)
      if (error) throw error
    },
    onMutate: async ({ memberId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous = queryClient.getQueryData<TeamMember[]>(QUERY_KEY)
      queryClient.setQueryData<TeamMember[]>(QUERY_KEY, (old = []) =>
        old.filter((m) => m.id !== memberId),
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
