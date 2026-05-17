import { describe, it, expect, beforeEach } from 'vitest'
import { usePresenceStore } from './presenceStore'

describe('presenceStore', () => {
  beforeEach(() => {
    usePresenceStore.setState({ onlineUsers: [] })
  })

  it('has an empty onlineUsers array by default', () => {
    expect(usePresenceStore.getState().onlineUsers).toEqual([])
  })

  it('setOnlineUsers updates the list', () => {
    const users = [
      { userId: 'u1', name: 'Alice' },
      { userId: 'u2', name: 'Bob' },
    ]
    usePresenceStore.getState().setOnlineUsers(users)
    expect(usePresenceStore.getState().onlineUsers).toEqual(users)
  })

  it('setOnlineUsers with an empty array clears the list', () => {
    usePresenceStore.getState().setOnlineUsers([{ userId: 'u1', name: 'Alice' }])
    usePresenceStore.getState().setOnlineUsers([])
    expect(usePresenceStore.getState().onlineUsers).toEqual([])
  })
})
