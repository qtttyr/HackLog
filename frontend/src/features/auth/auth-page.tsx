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
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      if (mode === 'register') {
        const { error, data } = await supabase.auth.signUp({ email, password })
        if (error) {
          setMessage(error.message)
        } else if (data.user) {
          setSessionEmail(email)
          
          // Check if session is immediately available (depends on Supabase config)
          const { data: sessionData } = await supabase.auth.getSession()
          if (sessionData.session) {
            // Session available, redirect to onboarding
            navigate('/')
          } else {
            // No immediate session - might need email verification
            // Show success message and keep them on auth page with option to login
            setMessage('Account created! You can now login with your email and password.')
            setMode('login')
            setPassword('')
          }
        }
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setMessage(error.message)
        } else if (data.session) {
          setSessionEmail(email)
          // Redirect to root - RootRoute will handle redirection based on onboarding status
          navigate('/')
        } else {
          setMessage('Login failed. Please check your credentials.')
        }
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <SectionCard title="Access your workspace" hint="Login or registration" className="bg-white">
        <div className="flex gap-3 mb-6">
          <Button
            variant={mode === 'login' ? 'primary' : 'ghost'}
            onClick={() => {
              setMode('login')
              setMessage('')
            }}
            type="button"
          >
            Login
          </Button>
          <Button
            variant={mode === 'register' ? 'primary' : 'ghost'}
            onClick={() => {
              setMode('register')
              setMessage('')
            }}
            type="button"
          >
            Register
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="eyebrow block mb-2">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required={mode === 'register'}
                />
              </div>
            </>
          )}

          <div>
            <label className="eyebrow block mb-2">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@team.com"
              type="email"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="eyebrow block mb-2">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full mt-6">
            {isLoading ? 'Loading...' : mode === 'login' ? 'Login' : 'Create account'}
          </Button>
        </form>

        {message && (
          <div className="mt-4 p-3 rounded-lg border-2 border-red-300 bg-red-50">
            <p className="text-sm text-red-700">{message}</p>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Made to feel easy under pressure." hint="What you get" className="bg-[#c7e7ff]">
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            'Separate clean pages for every step',
            'Responsive layout for laptop, tablet and phone',
            'Onboarding for solo and team flows',
            'Pitch and README generation from team context',
          ].map((item) => (
            <li key={item} className="rounded-[20px] border-3 border-black bg-white p-4 font-medium">
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}
