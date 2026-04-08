import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { SectionCard } from '../../components/ui/section-card'
import type { TaskStatus } from '../../types/domain'

interface Task {
  id: string
  title: string
  status: TaskStatus
  createdAt: string
}

const mockPersonalTasks: Task[] = [
  { id: '1', title: 'Review API documentation', status: 'done', createdAt: '2h ago' },
  { id: '2', title: 'Practice demo pitch', status: 'doing', createdAt: '30m ago' },
  { id: '3', title: 'Fix login bug', status: 'todo', createdAt: 'just now' },
  { id: '4', title: 'Write README section', status: 'todo', createdAt: 'just now' },
]

export function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockPersonalTasks)
  const [newTask, setNewTask] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const doingTasks = tasks.filter(t => t.status === 'doing')
  const doneTasks = tasks.filter(t => t.status === 'done')

  function addTask() {
    if (!newTask.trim()) return
    setTasks([...tasks, { id: crypto.randomUUID(), title: newTask, status: 'todo', createdAt: 'just now' }])
    setNewTask('')
    setShowAddForm(false)
  }

  function toggleStatus(taskId: string) {
    setTasks(tasks.map(task => {
      if (task.id !== taskId) return task
      const next: Record<TaskStatus, TaskStatus> = { todo: 'doing', doing: 'done', done: 'todo' }
      return { ...task, status: next[task.status] }
    }))
  }

  function deleteTask(taskId: string) {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-sm text-gray-600">Personal todo list - only visible to you</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>+ Add Task</Button>
      </div>

      {showAddForm && (
        <div className="rounded-xl border-2 border-black bg-[#ffd9f3] p-4">
          <p className="mb-2 font-bold">New Personal Task</p>
          <div className="flex gap-2">
            <Input 
              value={newTask} 
              onChange={(e) => setNewTask(e.target.value)} 
              placeholder="What do you need to do?"
              className="flex-1"
            />
            <Button onClick={addTask}>Add</Button>
            <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <SectionCard title={`To Do (${todoTasks.length})`} className="bg-white">
          <div className="space-y-2">
            {todoTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleStatus(task.id)} className="text-xl">⭕</button>
                  <span>{task.title}</span>
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-red-500">×</button>
              </div>
            ))}
            {todoTasks.length === 0 && <p className="text-sm text-gray-400">No tasks</p>}
          </div>
        </SectionCard>

        <SectionCard title={`In Progress (${doingTasks.length})`} className="bg-white">
          <div className="space-y-2">
            {doingTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between rounded-lg border border-yellow-300 bg-yellow-50 p-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleStatus(task.id)} className="text-xl">🔄</button>
                  <span>{task.title}</span>
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-red-500">×</button>
              </div>
            ))}
            {doingTasks.length === 0 && <p className="text-sm text-gray-400">No tasks</p>}
          </div>
        </SectionCard>

        <SectionCard title={`Done (${doneTasks.length})`} className="bg-white">
          <div className="space-y-2">
            {doneTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 p-3 opacity-70">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleStatus(task.id)} className="text-xl">✅</button>
                  <span className="line-through">{task.title}</span>
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-red-500">×</button>
              </div>
            ))}
            {doneTasks.length === 0 && <p className="text-sm text-gray-400">No tasks</p>}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}