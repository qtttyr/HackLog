import { Button } from '../../components/ui/button'
import { SectionCard } from '../../components/ui/section-card'
import { useGeneratePitch } from '../../hooks/use-generate-pitch'
import { useUiStore } from '../../store/ui-store'

export function PitchPage() {
  const team = useUiStore((state) => state.team)
  const pitch = useGeneratePitch('/api/pitch/generate')
  const readme = useGeneratePitch('/api/readme/generate')

  return (
    <div className="grid gap-6 pb-10 lg:grid-cols-2">
      <SectionCard title="Pitch studio" hint="Generate from decisions" className="bg-[#ffd36e]">
        <Button className="w-full" onClick={() => pitch.mutate(team.id)} disabled={pitch.isPending}>Generate pitch</Button>
        <pre className="brutal-card mt-4 whitespace-pre-wrap bg-white p-4 text-[0.92rem] leading-7 text-slate-800">
          {pitch.data?.content ?? 'Decisions will be summarized here after generation.'}
        </pre>
      </SectionCard>
      <SectionCard title="README studio" hint="Generate from tasks and decisions" className="bg-white">
        <Button className="w-full" variant="ghost" onClick={() => readme.mutate(team.id)} disabled={readme.isPending}>Generate README</Button>
        <pre className="brutal-card mt-4 whitespace-pre-wrap bg-[#f6f2ff] p-4 text-[0.92rem] leading-7 text-slate-800">
          {readme.data?.content ?? 'Tasks and decisions will be shaped into a polished README.'}
        </pre>
      </SectionCard>
    </div>
  )
}
