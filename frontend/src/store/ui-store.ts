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
  name: 'Null Pointer',
  hackathonName: 'HackLog Launch Jam',
  inviteCode: 'GREEN42',
  endsAt: '2026-04-02T18:00:00.000Z',
  membersOnline: 3,
  tasks: [
    { id: '1', title: 'Wire realtime board', status: 'doing', assignee: 'Ada' },
    { id: '2', title: 'Draft pitch story arc', status: 'todo', assignee: 'Mika' },
    { id: '3', title: 'Polish landing shell', status: 'done', assignee: 'Noor' },
  ],
  decisions: [
    { id: '1', content: 'Position HackLog as a calm command center.', createdAt: '2m ago' },
    { id: '2', content: 'Focus demo around live momentum, not raw task count.', createdAt: '8m ago' },
  ],
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
