import type { Task, TaskStatus } from '../../types/domain'
import { Button } from '../ui/button'

type TaskLaneProps = { title: string; status: TaskStatus; tasks: Task[]; onMove: (id: string, status: TaskStatus) => void }

const flow: TaskStatus[] = ['todo', 'doing', 'done']

export function TaskLane({ title, status, tasks, onMove }: TaskLaneProps) {
  return (
    <section className="brutal-card bg-white p-4">
      <p className="eyebrow">{title}</p>
      <div className="mt-4 space-y-3">
        {tasks.filter((task) => task.status === status).map((task) => (
          <article key={task.id} className="rounded-[20px] border-3 border-black bg-[#fff8c7] p-4">
            <h3 className="font-bold">{task.title}</h3>
            <p className="mt-2 text-[0.88rem] text-slate-700">{task.assignee}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {flow.filter((item) => item !== status).map((next) => (
                <Button key={next} variant="ghost" onClick={() => onMove(task.id, next)}>{next}</Button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
