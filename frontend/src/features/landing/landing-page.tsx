import { Link } from 'react-router-dom'
import { FeatureCard } from '../../components/marketing/feature-card'
import { SectionCard } from '../../components/ui/section-card'

const features = [
  ['Everything in one calm flow', 'Tasks, decisions, countdown, pitch and README stay connected so the team stops jumping between tools.', 'bg-[#c7ff66]'],
  ['Fast solo or team setup', 'Start alone in seconds or invite your team with a direct link and code that feels easy to trust.', 'bg-[#ffd9f3]'],
  ['Designed for pressure moments', 'Big touch targets, clean hierarchy and mobile-first layouts keep the product usable during finals.', 'bg-[#c7e7ff]'],
]

export function LandingPage() {
  return (
    <div className="space-y-6 pb-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Track the whole hackathon without the chaos." hint="Beautiful, fast, collaborative" className="bg-white">
          <p className="max-w-2xl text-balance text-[1rem] leading-7 text-slate-700 md:text-[1.1rem]">
            HackLog helps you move from idea to demo with one focused workspace for progress, decisions, team alignment and final pitch prep.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/auth" className="btn-primary">Start now</Link>
            <Link to="/dashboard" className="btn-ghost">View workspace</Link>
          </div>
        </SectionCard>
        <SectionCard title="Built for trust at first glance." hint="Comfort-first UX" className="bg-[#ffd36e]">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[20px] border-3 border-black bg-white p-4">
              <p className="eyebrow">Setup</p>
              <p className="mt-2 text-[1.8rem] font-black">2 min</p>
            </div>
            <div className="rounded-[20px] border-3 border-black bg-white p-4">
              <p className="eyebrow">Modes</p>
              <p className="mt-2 text-[1.8rem] font-black">Solo + Team</p>
            </div>
          </div>
        </SectionCard>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {features.map(([title, text, accent]) => (
          <FeatureCard key={title} title={title} text={text} accent={accent} />
        ))}
      </section>
    </div>
  )
}
