import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TeamSnapshot, TaskStatus, TeamMember } from '../types/domain'

type UiState = {
  mode: 'solo' | 'team'
  sessionEmail: string
  team: TeamSnapshot
  setMode: (mode: 'solo' | 'team') => void
  setSessionEmail: (email: string) => void
  clearTeam: () => void
  createTeam: (name: string, hackathonName: string) => void
  joinTeam: (inviteCode: string) => void
  setTaskStatus: (taskId: string, status: TaskStatus) => void
  addDecision: (content: string) => void
  // New methods for data persistence
  setTeamName: (name: string) => void
  setHackathonInfo: (info: { name: string; deadline: string; description?: string; link?: string }) => void
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void
  updateTeamMember: (memberId: string, updates: Partial<TeamMember>) => void
  removeTeamMember: (memberId: string) => void
  // Task methods
  addTask: (task: Omit<import('../types/domain').Task, 'id'>) => void
  removeTask: (taskId: string) => void
  updateTask: (taskId: string, updates: Partial<import('../types/domain').Task>) => void
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
  members: [],
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      mode: 'team',
      sessionEmail: '',
      team: seed,
      setMode: (mode) => set({ mode }),
      setSessionEmail: (sessionEmail) => set({ sessionEmail }),
      clearTeam: () => set({ team: seed, sessionEmail: '', mode: 'team' }),
      createTeam: (name, hackathonName) =>
        set((state) => ({ team: { ...state.team, name, hackathonName } })),
      joinTeam: (inviteCode) =>
        set((state) => ({ mode: 'team', team: { ...state.team, inviteCode } })),
      setTaskStatus: (taskId, status) =>
        set((state) => ({
          team: {
            ...state.team,
            tasks: state.team.tasks.map((task) =>
              task.id === taskId ? { ...task, status } : task
            ),
          },
        })),
      addDecision: (content) =>
        set((state) => ({
          team: {
            ...state.team,
            decisions: [
              {
                id: crypto.randomUUID(),
                content,
                createdAt: 'just now',
              },
              ...state.team.decisions,
            ],
          },
        })),

      // New methods for data persistence
      setTeamName: (name) =>
        set((state) => ({
          team: { ...state.team, name },
        })),

      setHackathonInfo: (info) =>
        set((state) => ({
          team: {
            ...state.team,
            hackathonName: info.name,
            endsAt: info.deadline,
          },
        })),

      addTeamMember: (member) =>
        set((state) => ({
          team: {
            ...state.team,
            members: [
              ...state.team.members,
              {
                ...member,
                id: crypto.randomUUID(),
              },
            ],
          },
        })),

      updateTeamMember: (memberId, updates) =>
        set((state) => ({
          team: {
            ...state.team,
            members: state.team.members.map((m) =>
              m.id === memberId ? { ...m, ...updates } : m
            ),
          },
        })),

      removeTeamMember: (memberId) =>
        set((state) => ({
          team: {
            ...state.team,
            members: state.team.members.filter((m) => m.id !== memberId),
          },
        })),

      // Task methods
      addTask: (task) =>
        set((state) => ({
          team: {
            ...state.team,
            tasks: [
              ...state.team.tasks,
              {
                ...task,
                id: crypto.randomUUID(),
              },
            ],
          },
        })),

      removeTask: (taskId) =>
        set((state) => ({
          team: {
            ...state.team,
            tasks: state.team.tasks.filter((t) => t.id !== taskId),
          },
        })),

      updateTask: (taskId, updates) =>
        set((state) => ({
          team: {
            ...state.team,
            tasks: state.team.tasks.map((t) =>
              t.id === taskId ? { ...t, ...updates } : t
            ),
          },
        })),
    }),
    {
      name: 'hacklog-team-state',
      partialize: (state) => ({
        team: state.team,
        mode: state.mode,
      }),
    }
  )
)
