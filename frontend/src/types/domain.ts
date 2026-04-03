export type TaskStatus = 'todo' | 'doing' | 'done'

export type Task = { id: string; title: string; status: TaskStatus; assignee?: string }
export type Decision = { id: string; content: string; createdAt: string }

export type TeamSnapshot = {
  id: string
  name: string
  hackathonName: string
  inviteCode: string
  endsAt: string
  membersOnline: number
  tasks: Task[]
  decisions: Decision[]
}
