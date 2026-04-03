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
            One clear snapshot of your hackathon: the countdown, the work in motion, the decisions that matter and the story you will present.
          </p>
        </SectionCard>
        <SectionCard title={mode === 'solo' ? 'Solo flow active' : 'Team flow active'} hint="Workspace mode" className="bg-white">
          <p className="text-[0.98rem] leading-7 text-slate-700">Invite code: {team.inviteCode}. Online now: {team.membersOnline}. Pitch assets stay synced with your board.</p>
        </SectionCard>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        <StatTile label="Time left" value={getTimeRemaining(team.endsAt)} note="Plenty of time to keep the team calm and focused." tone="bg-white" />
        <StatTile label="Open tasks" value={String(team.tasks.filter((task) => task.status !== 'done').length)} note="Everything still in motion is visible at a glance." tone="bg-[#ffd9f3]" />
        <StatTile label="Decisions" value={String(team.decisions.length)} note="Your product story is captured continuously, not reconstructed later." tone="bg-[#c7e7ff]" />
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <QuickLinkCard to="/board" title="Task board" text="Move work across lanes with clear ownership and mobile-friendly controls." cta="Open board" />
        <QuickLinkCard to="/decisions" title="Decision log" text="Capture product calls, trade-offs and demo notes while the context is fresh." cta="Open decisions" />
        <QuickLinkCard to="/pitch" title="Pitch studio" text="Turn real team activity into a clean pitch and README when it is time to present." cta="Open pitch" />
      </section>
    </div>
  )
}
