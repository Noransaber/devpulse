import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

type RecentTask = {
  id: string
  title: string
  updated_at: string
  columns: { name: string }[] | null
}

type HomeStats = {
  totalTasks: number | null
  inProgress: number | null
  doneToday: number | null
  recentTasks: RecentTask[]
}

export function useHomeStats() {
  const { data, isLoading } = useQuery<HomeStats>({
    queryKey: ['home-stats'],
    staleTime: 60_000,
    queryFn: async () => {
      const supabase = createClient()
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      const [
        { count: totalTasks },
        { count: inProgress },
        { count: doneToday },
        { data: recentTasks },
      ] = await Promise.all([
        supabase
          .from('tasks')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('tasks')
          .select('id, columns!inner(name)', { count: 'exact', head: true })
          .eq('columns.name', 'In Progress'),
        supabase
          .from('tasks')
          .select('id, columns!inner(name)', { count: 'exact', head: true })
          .eq('columns.name', 'Done')
          .gte('updated_at', todayStart.toISOString()),
        supabase
          .from('tasks')
          .select('id, title, updated_at, columns(name)')
          .order('updated_at', { ascending: false })
          .limit(5),
      ])

      return {
        totalTasks,
        inProgress,
        doneToday,
        recentTasks: (recentTasks ?? []) as RecentTask[],
      }
    },
  })

  return {
    totalTasks: data?.totalTasks ?? null,
    inProgress: data?.inProgress ?? null,
    doneToday: data?.doneToday ?? null,
    recentTasks: data?.recentTasks ?? [],
    isLoading,
  }
}
