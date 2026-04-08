import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { SectionCard } from '../../components/ui/section-card'
import { Crown, Code, Palette, Mic, Star, Sparkles } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'leader' | 'developer' | 'designer' | 'pitch' | 'other'
  roleLabel: string
  avatar?: string
}

const mockMembers: TeamMember[] = []

const roleOptions: { value: TeamMember['role']; label: string; icon: typeof Crown }[] = [
  { value: 'leader', label: 'Leader', icon: Crown },
  { value: 'developer', label: 'Developer', icon: Code },
  { value: 'designer', label: 'Designer', icon: Palette },
  { value: 'pitch', label: 'Pitch', icon: Mic },
  { value: 'other', label: 'Other', icon: Star },
]

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
  const colors = ['bg-pink-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200']
  const color = colors[name.length % colors.length]
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  }
  
  return (
    <div className={`${sizeClasses[size]} ${color} rounded-full flex items-center justify-center font-bold`}>
      {initials}
    </div>
  )
}

export function SettingsPage() {
  const [members, setMembers] = useState(mockMembers)
  const [isAssigning, setIsAssigning] = useState(false)

  function updateRole(memberId: string, newRole: TeamMember['role']) {
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, role: newRole, roleLabel: roleOptions.find(r => r.value === newRole)?.label || '' } : m
    ))
  }

  function assignRolesWithAI() {
    setIsAssigning(true)
    setTimeout(() => {
      const shuffled = [...members].sort(() => Math.random() - 0.5)
      const roles: TeamMember['role'][] = ['leader', 'developer', 'designer', 'pitch']
      const updated = shuffled.map((m, i) => ({
        ...m,
        role: roles[i % roles.length],
        roleLabel: roleOptions.find(r => r.value === roles[i % roles.length])?.label || '',
      }))
      setMembers(updated)
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
          {members.map(member => (
            <div key={member.id} className="flex flex-col gap-2 rounded-lg border-2 border-gray-200 p-3 md:flex-row md:items-center md:justify-between md:gap-4 md:p-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar name={member.name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{member.name}</p>
                  <p className="text-xs text-gray-500 truncate">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {(() => {
                  const RoleIcon = roleOptions.find(r => r.value === member.role)?.icon || Star
                  return <RoleIcon className="h-5 w-5 flex-shrink-0" />
                })()}
                <select
                  value={member.role}
                  onChange={(e) => updateRole(member.id, e.target.value as TeamMember['role'])}
                  className="rounded-lg border-2 border-black px-1.5 py-1 md:px-2 md:py-1.5 font-medium text-xs md:text-sm appearance-none bg-white bg-no-repeat flex-shrink-0 max-w-xs"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%23111%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E")', paddingRight: '1.5rem', backgroundPosition: 'right 0.4rem center' }}
                >
                  {roleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Add Team Member" className="bg-[#c7ff66]">
        <div className="flex gap-2">
          <Input placeholder="Email address" className="flex-1" />
          <Button>Invite</Button>
        </div>
        <p className="mt-2 text-sm text-gray-600">Send an invite link to join your team</p>
      </SectionCard>

      <SectionCard title="Hackathon Info" className="bg-[#c7e7ff]">
        <div className="space-y-3">
          <div>
            <label className="eyebrow block">Hackathon</label>
            <p className="font-medium">HackMIT 2026</p>
          </div>
          <div>
            <label className="eyebrow block">Deadline</label>
            <p className="font-medium">April 6, 2026, 6:00 PM</p>
          </div>
          <div>
            <label className="eyebrow block">Project</label>
            <p className="font-medium">HackLog - AI Team Assistant</p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}