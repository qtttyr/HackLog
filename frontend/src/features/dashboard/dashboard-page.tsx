import { QuickLinkCard } from '../../components/dashboard/quick-link-card'
import { StatTile } from '../../components/dashboard/stat-tile'
import { SectionCard } from '../../components/ui/section-card'
import { useUiStore } from '../../store/ui-store'
import { getTimeRemaining } from '../../utils/time'

export function DashboardPage() {
  const { team, mode } = useUiStore()
  return (
    <div className="space-y-6 pb-10">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title={`${team.name} is moving well.`} hint="Main dashboard" className="bg-[#c7ff66]">
          <p className="max-w-2xl text-[1rem] leading-7 text-slate-800">
            One clear snapshot of your hackathon: the countdown, the work in motion, the ideas that matter and the strategy you will present.
          </p>
        </SectionCard>
        <SectionCard title={mode === 'solo' ? 'Solo flow active' : 'Team flow active'} hint="Workspace mode" className="bg-white">
          <p className="text-[0.98rem] leading-7 text-slate-700">Invite code: {team.inviteCode}. Online now: {team.membersOnline}. Progress stays synced across all your devices.</p>
        </SectionCard>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        <StatTile label="Time left" value={getTimeRemaining(team.endsAt)} note="Plenty of time to keep the team calm and focused." tone="bg-white" />
        <StatTile label="Open tasks" value={String(team.tasks.filter((task) => task.status !== 'done').length)} note="Everything still in motion is visible at a glance." tone="bg-[#ffd9f3]" />
        <StatTile label="Ideas" value={String(team.ideas.length)} note="Your best ideas are captured and prioritized continuously." tone="bg-[#c7e7ff]" />
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <QuickLinkCard to="/board" title="Canvas Board" text="Visualize your project on an infinite canvas. Move, connect, and organize ideas." cta="Open board" />
        <QuickLinkCard to="/tasks" title="Tasks & Timeline" text="Keep team and personal tasks organized. Track progress across the hackathon." cta="Manage tasks" />
        <QuickLinkCard to="/brainstorm" title="AI Ideas" text="Brainstorm and vote on ideas. Organize by theme and track what matters." cta="View ideas" />
      </section>
    </div>
  )
}
