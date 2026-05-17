import { create } from 'zustand'

interface BoardFilterState {
  search: string
  assigneeId: string | null
  columnId: string | null
  setSearch: (v: string) => void
  setAssigneeId: (v: string | null) => void
  setColumnId: (v: string | null) => void
  reset: () => void
}

export const useBoardFilterStore = create<BoardFilterState>((set) => ({
  search: '',
  assigneeId: null,
  columnId: null,
  setSearch: (v) => set({ search: v }),
  setAssigneeId: (v) => set({ assigneeId: v }),
  setColumnId: (v) => set({ columnId: v }),
  reset: () => set({ search: '', assigneeId: null, columnId: null }),
}))
