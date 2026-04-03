import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { SectionCard } from '../../components/ui/section-card'
import { supabase } from '../../lib/supabase'
import { useUiStore } from '../../store/ui-store'

export function AuthPage() {
  const navigate = useNavigate()
  const setSessionEmail = useUiStore((state) => state.setSessionEmail)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('Use one magic link for secure login or registration.')

  async function handleContinue() {
    const { error } = await supabase.auth.signInWithOtp({ email })
    setSessionEmail(email)
    setMessage(error ? error.message : 'Magic link sent. You can continue to onboarding right away.')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <SectionCard title="Access your workspace" hint="Login or registration" className="bg-white">
        <div className="flex gap-3">
          <Button variant={mode === 'login' ? 'primary' : 'ghost'} onClick={() => setMode('login')}>Login</Button>
          <Button variant={mode === 'register' ? 'primary' : 'ghost'} onClick={() => setMode('register')}>Register</Button>
        </div>
        <label className="eyebrow mt-6 block">Email</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@team.com" />
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={handleContinue}>{mode === 'login' ? 'Send login link' : 'Create account'}</Button>
          <Button variant="ghost" onClick={() => navigate('/onboarding')}>Continue to onboarding</Button>
        </div>
        <p className="mt-4 text-[0.95rem] leading-6 text-slate-700">{message}</p>
      </SectionCard>
      <SectionCard title="Made to feel easy under pressure." hint="What you get" className="bg-[#c7e7ff]">
        <ul className="grid gap-3 md:grid-cols-2">
          {['Separate clean pages for every step', 'Responsive layout for laptop, tablet and phone', 'Onboarding for solo and team flows', 'Pitch and README generation from team context'].map((item) => (
            <li key={item} className="rounded-[20px] border-3 border-black bg-white p-4 font-medium">{item}</li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}
