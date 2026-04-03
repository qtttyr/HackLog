import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { SectionCard } from '../../components/ui/section-card'
import { useUiStore } from '../../store/ui-store'

export function OnboardingPage() {
  const navigate = useNavigate()
  const { team, mode, setMode, createTeam, joinTeam } = useUiStore()
  const [name, setName] = useState(team.name)
  const [hackathon, setHackathon] = useState(team.hackathonName)
  const [code, setCode] = useState(team.inviteCode)
  const inviteLink = useMemo(() => `https://hacklog.app/join/${team.inviteCode}`, [team.inviteCode])

  async function copyInvite() {
    await navigator.clipboard.writeText(`${inviteLink} | code: ${team.inviteCode}`)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      <SectionCard title="Choose how you want to work" hint="Solo or team" className="bg-[#ffd9f3]">
        <div className="flex flex-wrap gap-3">
          <Button variant={mode === 'solo' ? 'primary' : 'ghost'} onClick={() => setMode('solo')}>Work solo</Button>
          <Button variant={mode === 'team' ? 'primary' : 'ghost'} onClick={() => setMode('team')}>Invite team</Button>
        </div>
        <label className="eyebrow mt-6 block">Project name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <label className="eyebrow mt-4 block">Hackathon name</label>
        <Input value={hackathon} onChange={(e) => setHackathon(e.target.value)} />
        <Button className="mt-5" onClick={() => {
          createTeam(name, hackathon)
          localStorage.setItem('onboarding_completed', 'true')
          navigate('/dashboard')
        }}>Save workspace</Button>
      </SectionCard>
      <SectionCard title="Invite flow that feels effortless" hint="Share link or code" className="bg-white">
        <label className="eyebrow block">Invite code</label>
        <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={() => {
            joinTeam(code)
            localStorage.setItem('onboarding_completed', 'true')
            navigate('/dashboard')
          }}>Use code</Button>
          <Button variant="ghost" onClick={copyInvite}>Copy invite</Button>
        </div>
        <div className="mt-5 rounded-[24px] border-3 border-black bg-[#fff8c7] p-4">
          <p className="eyebrow">Invite link</p>
          <p className="mt-2 break-all text-[0.96rem] leading-6">{inviteLink}</p>
        </div>
      </SectionCard>
    </div>
  )
}
