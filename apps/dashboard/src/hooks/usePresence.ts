'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'

export interface OnlineUser {
  userId: string
  name: string
}

export function usePresence() {
  const { user } = useUser()
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])

  useEffect(() => {
    if (!user) return

    const supabase = createClient()
    const channel = supabase.channel('online-users', {
      config: { presence: { key: user.id } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<OnlineUser>()
        const seen = new Set<string>()
        const users = Object.values(state)
          .flat()
          .filter((u) => {
            if (seen.has(u.userId)) return false
            seen.add(u.userId)
            return true
          })
        setOnlineUsers(users)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId: user.id,
            name: user.fullName ?? user.username ?? 'Anonymous',
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return onlineUsers
}
