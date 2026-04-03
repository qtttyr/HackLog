import { TaskLane } from '../../components/board/task-lane'
import { SectionCard } from '../../components/ui/section-card'
import { useUiStore } from '../../store/ui-store'

export function BoardPage() {
  const { team, setTaskStatus } = useUiStore()
  return (
    <div className="space-y-6 pb-10">
      <SectionCard title="Task board built for clarity" hint="Kanban flow" className="bg-white">
        <p className="text-[0.98rem] leading-7 text-slate-700">A roomy layout, large controls and bold cards keep collaboration comfortable on desktop and touch devices.</p>
      </SectionCard>
      <div className="grid gap-6 xl:grid-cols-3">
        <TaskLane title="To do" status="todo" tasks={team.tasks} onMove={setTaskStatus} />
        <TaskLane title="Doing" status="doing" tasks={team.tasks} onMove={setTaskStatus} />
        <TaskLane title="Done" status="done" tasks={team.tasks} onMove={setTaskStatus} />
      </div>
    </div>
  )
}
