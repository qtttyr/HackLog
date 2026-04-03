import { useState } from 'react'
import { DecisionItem } from '../../components/decisions/decision-item'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { SectionCard } from '../../components/ui/section-card'
import { useUiStore } from '../../store/ui-store'

export function DecisionsPage() {
  const { team, addDecision } = useUiStore()
  const [draft, setDraft] = useState('')
  return (
    <div className="grid gap-6 pb-10 lg:grid-cols-[0.85fr_1.15fr]">
      <SectionCard title="Capture decisions while they are fresh" hint="Decision log" className="bg-[#c7e7ff]">
        <label className="eyebrow block">New decision</label>
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Example: prioritize mobile demo over analytics depth" />
        <Button className="mt-5" onClick={() => { if (draft) addDecision(draft); setDraft('') }}>Save decision</Button>
      </SectionCard>
      <section className="space-y-4">
        {team.decisions.map((decision) => <DecisionItem key={decision.id} decision={decision} />)}
      </section>
    </div>
  )
}
