import { create } from 'zustand'
import type { TeamSnapshot, TaskStatus } from '../types/domain'

type UiState = {
  mode: 'solo' | 'team'
  sessionEmail: string
  team: TeamSnapshot
  setMode: (mode: 'solo' | 'team') => void
  setSessionEmail: (email: string) => void
  createTeam: (name: string, hackathonName: string) => void
  joinTeam: (inviteCode: string) => void
  setTaskStatus: (taskId: string, status: TaskStatus) => void
  addDecision: (content: string) => void
}

const seed: TeamSnapshot = {
  id: 'team-01',
  name: '',
  hackathonName: '',
  inviteCode: '',
  endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  membersOnline: 0,
  tasks: [],
  decisions: [],
  ideas: [],
}

export const useUiStore = create<UiState>((set) => ({
  mode: 'team',
  sessionEmail: '',
  team: seed,
  setMode: (mode) => set({ mode }),
  setSessionEmail: (sessionEmail) => set({ sessionEmail }),
  createTeam: (name, hackathonName) => set((state) => ({ team: { ...state.team, name, hackathonName } })),
  joinTeam: (inviteCode) => set((state) => ({ mode: 'team', team: { ...state.team, inviteCode } })),
  setTaskStatus: (taskId, status) =>
    set((state) => ({ team: { ...state.team, tasks: state.team.tasks.map((task) => task.id === taskId ? { ...task, status } : task) } })),
  addDecision: (content) =>
    set((state) => ({ team: { ...state.team, decisions: [{ id: crypto.randomUUID(), content, createdAt: 'just now' }, ...state.team.decisions] } })),
}))
