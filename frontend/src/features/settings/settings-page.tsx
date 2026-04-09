import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { SectionCard } from '../../components/ui/section-card'
import { useUiStore } from '../../store/ui-store'
import { Crown, Code, Palette, Mic, Star, Sparkles, Trash2 } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'leader' | 'developer' | 'designer' | 'pitch' | 'other'
  roleLabel: string
  avatar?: string
}

const roleOptions: { value: TeamMember['role']; label: string; icon: typeof Crown }[] = [
  { value: 'leader', label: 'Leader', icon: Crown },
  { value: 'developer', label: 'Developer', icon: Code },
  { value: 'designer', label: 'Designer', icon: Palette },
  { value: 'pitch', label: 'Pitch', icon: Mic },
  { value: 'other', label: 'Other', icon: Star },
]

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
  // Use brand colors from Brutal style instead of light grays
  const bgColors = ['bg-[#c7ff66]', 'bg-[#ffd9f3]', 'bg-[#c7e7ff]', 'bg-[#fff8c7]', 'bg-pink-400']
  const textColors = ['text-black', 'text-black', 'text-black', 'text-black', 'text-black']
  const bgColor = bgColors[name.length % bgColors.length]
  const textColor = textColors[name.length % textColors.length]
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  }
  
  return (
    <div className={`${sizeClasses[size]} ${bgColor} ${textColor} rounded-full flex items-center justify-center font-bold border-2 border-black`}>
      {initials}
    </div>
  )
}

export function SettingsPage() {
  const { team, updateTeamMember, removeTeamMember, addTeamMember } = useUiStore()
  const [inviteEmail, setInviteEmail] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)

  function handleInvite() {
    if (!inviteEmail.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    addTeamMember({
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: 'other',
    })

    setInviteEmail('')
  }

  function updateRole(memberId: string, newRole: TeamMember['role']) {
    updateTeamMember(memberId, {
      role: newRole,
    })
  }

  function assignRolesWithAI() {
    setIsAssigning(true)
    setTimeout(() => {
      const shuffled = [...team.members].sort(() => Math.random() - 0.5)
      const roles: TeamMember['role'][] = ['leader', 'developer', 'designer', 'pitch']
      shuffled.forEach((m, i) => {
        updateTeamMember(m.id, {
          role: roles[i % roles.length],
        })
      })
      setIsAssigning(false)
    }, 1500)
  }

   return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Settings</h1>
          <p className="text-sm text-gray-600">Manage your team and roles</p>
        </div>
        <Button onClick={assignRolesWithAI} disabled={isAssigning} className="md:whitespace-nowrap">
          {isAssigning ? '🤖 Assigning...' : <><Sparkles className="h-4 w-4 inline mr-1" />AI Assign Roles</>}
        </Button>
      </div>

      <SectionCard title="Team Members" className="bg-white">
        <div className="space-y-3">
          {team.members.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No team members yet. Add your first member below.</p>
          ) : (
            team.members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 rounded-lg border-2 border-black p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                   <Avatar name={member.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate">{member.name}</p>
                    <p className="text-xs text-gray-600 truncate">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  {(() => {
                    const RoleIcon = roleOptions.find((r) => r.value === member.role)?.icon || Star
                    return <RoleIcon className="h-5 w-5 flex-shrink-0 text-black" />
                  })()}
                  <select
                    value={member.role}
                    onChange={(e) => updateRole(member.id, e.target.value as TeamMember['role'])}
                    className="flex-1 sm:flex-none rounded-lg border-2 border-black px-2 py-1.5 font-bold text-sm appearance-none bg-white bg-no-repeat text-black"
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%23000%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E")',
                      paddingRight: '1.75rem',
                      backgroundPosition: 'right 0.4rem center',
                    }}
                  >
                    {roleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeTeamMember(member.id)}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border-2 border-black bg-white text-black hover:bg-red-100 hover:border-red-500 hover:text-red-600 transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>

      <SectionCard title="Add Team Member" className="bg-[#c7ff66]">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
              placeholder="Email address"
              className="flex-1"
            />
            <Button onClick={handleInvite}>Invite</Button>
          </div>
          <p className="text-sm text-gray-600">Add a new team member by email address</p>
        </div>
      </SectionCard>

      <SectionCard title="Hackathon Info" className="bg-[#c7e7ff]">
        <div className="space-y-4">
          <div>
            <label className="eyebrow block mb-2">Hackathon Name</label>
            <p className="font-medium text-lg">{team.hackathonName || 'Not set'}</p>
          </div>
          <div>
            <label className="eyebrow block mb-2">Deadline</label>
            <p className="font-medium text-lg">
              {team.endsAt
                ? new Date(team.endsAt).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Not set'}
            </p>
          </div>
          <div>
            <label className="eyebrow block mb-2">Project Name</label>
            <p className="font-medium text-lg">{team.name || 'Not set'}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}