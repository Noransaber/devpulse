import { create } from 'zustand'
import type { OnlineUser } from '@/hooks/usePresence'

interface PresenceState {
  onlineUsers: OnlineUser[]
  setOnlineUsers: (users: OnlineUser[]) => void
}

export const usePresenceStore = create<PresenceState>((set) => ({
  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}))
