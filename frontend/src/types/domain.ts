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
  ideas: BrainstormIdea[]
}

export type TeamMember = {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

export type PersonalTask = {
  id: string
  title: string
  status: TaskStatus
  createdAt: string
}

export type RoadmapNode = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  parentId?: string
  children?: RoadmapNode[]
  order: number
}

export type BrainstormIdea = {
  id: string
  title: string
  description: string
  votes: number
  createdBy: string
}

export type TeamRole = {
  userId: string
  roleName: 'leader' | 'developer' | 'designer' | 'pitch' | 'other'
  roleLabel?: string
}
