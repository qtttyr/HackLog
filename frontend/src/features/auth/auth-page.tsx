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
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    if (mode === 'register') {
      const { error, data } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message)
      } else if (data.user) {
        setSessionEmail(email)
        navigate('/onboarding')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        setSessionEmail(email)
        const onboardingCompleted = localStorage.getItem('onboarding_completed')
        navigate(onboardingCompleted ? '/dashboard' : '/onboarding')
      }
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <SectionCard title="Access your workspace" hint="Login or registration" className="bg-white">
        <div className="flex gap-3">
          <Button variant={mode === 'login' ? 'primary' : 'ghost'} onClick={() => setMode('login')}>Login</Button>
          <Button variant={mode === 'register' ? 'primary' : 'ghost'} onClick={() => setMode('register')}>Register</Button>
        </div>
        {mode === 'register' && (
          <>
            <label className="eyebrow mt-6 block">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </>
        )}
        <label className={`eyebrow mt-${mode === 'register' ? '4' : '6'} block`}>Email</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@team.com" type="email" />
        <label className="eyebrow mt-4 block">Password</label>
        <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" />
        <div className="mt-5">
          <Button onClick={handleSubmit}>{mode === 'login' ? 'Login' : 'Create account'}</Button>
        </div>
        {message && <p className="mt-4 text-[0.95rem] leading-6 text-slate-700">{message}</p>}
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
