import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { SectionCard } from '../../components/ui/section-card'
import { useUiStore } from '../../store/ui-store'
import type { TaskStatus, Task } from '../../types/domain'
import { ChevronLeft, ChevronRight, Trash2, Circle, CheckCircle, Clock } from 'lucide-react'

type TabType = 'team' | 'personal'

export function TasksPage() {
  const { team, addTask: storeAddTask, removeTask: storeRemoveTask, setTaskStatus } = useUiStore()
  const [tab, setTab] = useState<TabType>('team')
  const [newTask, setNewTask] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  // Filter tasks by status for display
  const allTasks = team.tasks
  const todoTasks = allTasks.filter((t) => t.status === 'todo')
  const doingTasks = allTasks.filter((t) => t.status === 'doing')
  const doneTasks = allTasks.filter((t) => t.status === 'done')

  function handleAddTask() {
    if (!newTask.trim()) return
    storeAddTask({ 
      title: newTask, 
      status: 'todo',
      ...(tab === 'team' && { assignee: 'You' })
    })
    setNewTask('')
    setShowAddForm(false)
  }

  function moveTask(taskId: string, direction: 'left' | 'right') {
    const task = allTasks.find(t => t.id === taskId)
    if (!task) return
    
    const order: TaskStatus[] = ['todo', 'doing', 'done']
    const currentIndex = order.indexOf(task.status)
    const newIndex = direction === 'left' ? Math.max(0, currentIndex - 1) : Math.min(2, currentIndex + 1)
    const newStatus = order[newIndex]
    
    setTaskStatus(taskId, newStatus)
  }

  function deleteTask(taskId: string) {
    storeRemoveTask(taskId)
  }

  function toggleStatus(taskId: string) {
    const task = allTasks.find(t => t.id === taskId)
    if (!task) return
    
    const next: Record<TaskStatus, TaskStatus> = { todo: 'doing', doing: 'done', done: 'todo' }
    setTaskStatus(taskId, next[task.status])
  }

  const TeamTaskCard = ({ task }: { task: Task }) => {
    const statusIndex = ['todo', 'doing', 'done'].indexOf(task.status)
    const bgColor = task.status === 'done' ? 'bg-green-50' : task.status === 'doing' ? 'bg-yellow-50' : 'bg-white'
    
    return (
      <div className={`rounded-lg border-2 border-black ${bgColor} p-3`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="font-medium text-sm">{task.title}</p>
            {task.assignee && (
              <p className="mt-1 text-xs text-gray-600">👤 {task.assignee}</p>
            )}
          </div>
          <button 
            onClick={() => deleteTask(task.id)}
            className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <button 
            onClick={() => moveTask(task.id, 'left')}
            disabled={statusIndex === 0}
            className="p-1.5 rounded border-2 border-black hover:bg-gray-100 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className={`text-[10px] font-bold px-2 py-1 rounded border border-black ${
            task.status === 'done' ? 'bg-green-200 text-green-900' :
            task.status === 'doing' ? 'bg-yellow-200 text-yellow-900' :
            'bg-gray-200 text-gray-900'
          }`}>
            {task.status.toUpperCase()}
          </span>
          <button 
            onClick={() => moveTask(task.id, 'right')}
            disabled={statusIndex === 2}
            className="p-1.5 rounded border-2 border-black hover:bg-gray-100 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  const PersonalTaskCard = ({ task }: { task: Task }) => {
    const bgColor = 
      task.status === 'done' ? 'bg-green-100' : 
      task.status === 'doing' ? 'bg-yellow-100' : 
      'bg-white'
    
    const Icon = task.status === 'done' ? CheckCircle : task.status === 'doing' ? Clock : Circle
    
    return (
      <div className={`flex items-center gap-3 rounded-lg border-2 border-black ${bgColor} p-3`}>
        <button 
          onClick={() => toggleStatus(task.id)}
          className="flex-shrink-0 p-1 hover:scale-110 transition-transform"
        >
          <Icon className={`h-5 w-5 ${
            task.status === 'done' ? 'text-green-700' :
            task.status === 'doing' ? 'text-yellow-700' :
            'text-gray-600'
          }`} />
        </button>
         <div className="flex-1 min-w-0">
           <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
             {task.title}
           </p>
         </div>
        <button 
          onClick={() => deleteTask(task.id)}
          className="flex-shrink-0 p-1 hover:bg-red-100 rounded transition-colors"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    )
  }

  const isTeamTab = tab === 'team'

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-sm text-gray-600">Manage your team and personal tasks</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>+ Add Task</Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b-2 border-black md:gap-4">
        <button
          onClick={() => setTab('team')}
          className={`px-4 py-2 font-bold text-sm border-b-4 transition-all ${
            isTeamTab
              ? 'border-[#c7ff66] text-black'
              : 'border-transparent text-gray-600 hover:text-black'
          }`}
        >
          Team Tasks
        </button>
        <button
          onClick={() => setTab('personal')}
          className={`px-4 py-2 font-bold text-sm border-b-4 transition-all ${
            !isTeamTab
              ? 'border-[#ffd9f3] text-black'
              : 'border-transparent text-gray-600 hover:text-black'
          }`}
        >
          My Tasks
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className={`rounded-lg border-2 border-black p-4 ${isTeamTab ? 'bg-[#c7ff66]' : 'bg-[#ffd9f3]'}`}>
          <p className="mb-3 font-bold">{isTeamTab ? 'Add Team Task' : 'Add Personal Task'}</p>
          <div className="flex flex-col gap-2 md:flex-row md:gap-2">
            <Input 
              value={newTask} 
              onChange={(e) => setNewTask(e.target.value)} 
              placeholder={isTeamTab ? 'Task title...' : 'What do you need to do?'}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddTask} className="whitespace-nowrap">Add</Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)} className="whitespace-nowrap">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Display */}
      {isTeamTab ? (
        <div className="grid gap-4 md:grid-cols-3">
          <SectionCard title={`To Do (${todoTasks.length})`} className="bg-gray-50">
            <div className="space-y-3">
              {todoTasks.map(task => <TeamTaskCard key={task.id} task={task} />)}
              {todoTasks.length === 0 && <p className="text-sm text-gray-400">No tasks</p>}
            </div>
          </SectionCard>
          <SectionCard title={`In Progress (${doingTasks.length})`} className="bg-yellow-50">
            <div className="space-y-3">
              {doingTasks.map(task => <TeamTaskCard key={task.id} task={task} />)}
              {doingTasks.length === 0 && <p className="text-sm text-gray-400">No tasks</p>}
            </div>
          </SectionCard>
          <SectionCard title={`Done (${doneTasks.length})`} className="bg-green-50">
            <div className="space-y-3">
              {doneTasks.map(task => <TeamTaskCard key={task.id} task={task} />)}
              {doneTasks.length === 0 && <p className="text-sm text-gray-400">No tasks</p>}
            </div>
          </SectionCard>
        </div>
      ) : (
        <div className="space-y-4">
          {todoTasks.length > 0 && (
            <div>
              <h3 className="mb-2 font-bold text-sm">To Do ({todoTasks.length})</h3>
              <div className="space-y-2">
                {todoTasks.map(task => <PersonalTaskCard key={task.id} task={task} />)}
              </div>
            </div>
          )}
          {doingTasks.length > 0 && (
            <div>
              <h3 className="mb-2 font-bold text-sm">In Progress ({doingTasks.length})</h3>
              <div className="space-y-2">
                {doingTasks.map(task => <PersonalTaskCard key={task.id} task={task} />)}
              </div>
            </div>
          )}
          {doneTasks.length > 0 && (
            <div>
              <h3 className="mb-2 font-bold text-sm">Done ({doneTasks.length})</h3>
              <div className="space-y-2">
                {doneTasks.map(task => <PersonalTaskCard key={task.id} task={task} />)}
              </div>
            </div>
          )}
          {allTasks.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No tasks yet. Create one to get started!</p>
          )}
        </div>
      )}
    </div>
  )
}