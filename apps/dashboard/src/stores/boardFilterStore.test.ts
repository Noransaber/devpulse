import { describe, it, expect, beforeEach } from 'vitest'
import { useBoardFilterStore } from './boardFilterStore'

describe('boardFilterStore', () => {
  beforeEach(() => {
    useBoardFilterStore.getState().reset()
  })

  it('has empty search, null assigneeId, and null columnId by default', () => {
    const { search, assigneeId, columnId } = useBoardFilterStore.getState()
    expect(search).toBe('')
    expect(assigneeId).toBeNull()
    expect(columnId).toBeNull()
  })

  it('setSearch updates the search value', () => {
    useBoardFilterStore.getState().setSearch('fix bug')
    expect(useBoardFilterStore.getState().search).toBe('fix bug')
  })

  it('setAssigneeId updates the assigneeId', () => {
    useBoardFilterStore.getState().setAssigneeId('user-123')
    expect(useBoardFilterStore.getState().assigneeId).toBe('user-123')
  })

  it('setColumnId updates the columnId', () => {
    useBoardFilterStore.getState().setColumnId('col-abc')
    expect(useBoardFilterStore.getState().columnId).toBe('col-abc')
  })

  it('reset returns all fields to initial state', () => {
    const store = useBoardFilterStore.getState()
    store.setSearch('test')
    store.setAssigneeId('user-1')
    store.setColumnId('col-1')
    store.reset()
    const { search, assigneeId, columnId } = useBoardFilterStore.getState()
    expect(search).toBe('')
    expect(assigneeId).toBeNull()
    expect(columnId).toBeNull()
  })
})
