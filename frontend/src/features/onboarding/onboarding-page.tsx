import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { SectionCard } from '../../components/ui/section-card'
import { useUiStore } from '../../store/ui-store'

type Step = 'team' | 'hackathon' | 'idea' | 'ready'

interface TeamMember {
  name: string
  role: string
  email: string
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const { team, createTeam } = useUiStore()
  
  const [step, setStep] = useState<Step>('team')
  const [mode, setModeLocal] = useState<'solo' | 'team'>('solo')
  
  const [projectName, setProjectName] = useState(team.name)
  const [members, setMembers] = useState<TeamMember[]>([
    { name: '', role: '', email: '' }
  ])
  
  const [hackathonName, setHackathonName] = useState('')
  const [hackathonDeadline, setHackathonDeadline] = useState('')
  const [hackathonDescription, setHackathonDescription] = useState('')
  const [hackathonLink, setHackathonLink] = useState('')
  
  const [projectIdea, setProjectIdea] = useState('')

  function addMember() {
    setMembers([...members, { name: '', role: '', email: '' }])
  }

  function updateMember(index: number, field: keyof TeamMember, value: string) {
    const newMembers = [...members]
    newMembers[index][field] = value
    setMembers(newMembers)
  }

  function removeMember(index: number) {
    setMembers(members.filter((_, i) => i !== index))
  }

  function handleNext() {
    if (step === 'team') {
      createTeam(projectName, hackathonName)
      localStorage.setItem('onboarding_data', JSON.stringify({
        projectName,
        mode,
        members,
        hackathonName,
        hackathonDeadline,
        hackathonDescription,
        hackathonLink,
        projectIdea
      }))
      setStep('hackathon')
    } else if (step === 'hackathon') {
      setStep('idea')
    } else if (step === 'idea') {
      setStep('ready')
    } else {
      localStorage.setItem('onboarding_completed', 'true')
      navigate('/dashboard')
    }
  }

  function handleBack() {
    if (step === 'hackathon') setStep('team')
    else if (step === 'idea') setStep('hackathon')
    else if (step === 'ready') setStep('idea')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center justify-center gap-2">
        {['team', 'hackathon', 'idea', 'ready'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold ${
              step === s ? 'border-black bg-black text-white' :
              ['team', 'hackathon', 'idea', 'ready'].indexOf(step) > i ? 'border-black bg-[#c7ff66] text-black' :
              'border-gray-300 bg-white text-gray-400'
            }`}>
              {i + 1}
            </div>
            {i < 3 && <div className={`h-0.5 w-8 ${['team', 'hackathon', 'idea'].indexOf(step) > i ? 'bg-black' : 'bg-gray-300'}`} />}
          </div>
        ))}
      </div>

      {step === 'team' && (
        <div className="space-y-6">
          <SectionCard title="Set up your workspace" hint="Step 1 of 4" className="bg-[#ffd9f3]">
            <div className="flex gap-3">
              <Button variant={mode === 'solo' ? 'primary' : 'ghost'} onClick={() => setModeLocal('solo')}>Solo</Button>
              <Button variant={mode === 'team' ? 'primary' : 'ghost'} onClick={() => setModeLocal('team')}>Team</Button>
            </div>
            
            <label className="eyebrow mt-6 block">Project name</label>
            <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="My Awesome Project" />
            
            {mode === 'team' && (
              <>
                <label className="eyebrow mt-6 block">Team members</label>
                <div className="space-y-3">
                  {members.map((member, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border-2 border-gray-200 p-3">
                      <Input 
                        value={member.name} 
                        onChange={(e) => updateMember(i, 'name', e.target.value)} 
                        placeholder="Name" 
                        className="flex-1 min-w-[100px]"
                      />
                      <Input 
                        value={member.role} 
                        onChange={(e) => updateMember(i, 'role', e.target.value)} 
                        placeholder="Role" 
                        className="flex-1 min-w-[100px]"
                      />
                      <Input 
                        value={member.email} 
                        onChange={(e) => updateMember(i, 'email', e.target.value)} 
                        placeholder="Email" 
                        className="flex-1 min-w-[120px]"
                      />
                      {members.length > 1 && (
                        <button 
                          onClick={() => removeMember(i)} 
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 border border-gray-300 text-gray-600 hover:bg-red-100 hover:border-red-400 hover:text-red-600 text-lg font-bold transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="ghost" onClick={addMember} className="mt-3">+ Add member</Button>
              </>
            )}
          </SectionCard>
        </div>
      )}

      {step === 'hackathon' && (
        <div className="space-y-6">
          <SectionCard title="Tell us about the hackathon" hint="Step 2 of 4" className="bg-[#c7e7ff]">
            <label className="eyebrow block">Hackathon name</label>
            <Input value={hackathonName} onChange={(e) => setHackathonName(e.target.value)} placeholder="HackMIT 2026" />
            
            <label className="eyebrow mt-4 block">Deadline</label>
            <Input value={hackathonDeadline} onChange={(e) => setHackathonDeadline(e.target.value)} type="datetime-local" />
            
            <label className="eyebrow mt-4 block">Description (optional)</label>
            <textarea 
              value={hackathonDescription} 
              onChange={(e) => setHackathonDescription(e.target.value)} 
              placeholder="What is this hackathon about?"
              className="w-full rounded-xl border-2 border-black p-3 text-sm"
              rows={3}
            />
            
            <label className="eyebrow mt-4 block">Link (optional)</label>
            <Input value={hackathonLink} onChange={(e) => setHackathonLink(e.target.value)} placeholder="https://hackmit.dev" />
          </SectionCard>
        </div>
      )}

      {step === 'idea' && (
        <div className="space-y-6">
          <SectionCard title="Your project idea" hint="Step 3 of 4" className="bg-[#fff8c7]">
            <p className="mb-4 text-sm text-gray-600">Tell us briefly what you're building. Our AI will help shape your roadmap.</p>
            <textarea 
              value={projectIdea} 
              onChange={(e) => setProjectIdea(e.target.value)} 
              placeholder="We're building a real-time collaboration tool for hackathon teams..."
              className="w-full rounded-xl border-2 border-black p-3 text-sm"
              rows={5}
            />
          </SectionCard>
        </div>
      )}

      {step === 'ready' && (
        <div className="space-y-6">
          <SectionCard title="You're all set!" hint="Step 4 of 4" className="bg-[#c7ff66]">
            <p className="text-lg">Your workspace is ready.</p>
            <p className="mt-2 text-sm text-gray-600">
              AI will analyze your hackathon and project idea to help you with your roadmap.
            </p>
            <div className="mt-6 flex gap-3">
              <Button onClick={handleNext}>Go to Dashboard</Button>
            </div>
          </SectionCard>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        {step !== 'team' ? (
          <Button variant="ghost" onClick={handleBack} className="px-5 text-sm">
            Back
          </Button>
        ) : (
          <div />
        )}
        {step !== 'ready' && (
          <Button onClick={handleNext} className="px-5 text-sm">
            {step === 'hackathon' ? 'Analyze with AI' : step === 'idea' ? 'Continue' : 'Next'}
          </Button>
        )}
      </div>
    </div>
  )
}
