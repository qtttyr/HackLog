import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { BrandMark } from '../ui/brand-mark'
import { LivePill } from '../ui/live-pill'
import { useSession } from '../../hooks/use-session'
import { useUiStore } from '../../store/ui-store'
import { supabase } from '../../lib/supabase'
import { getTimeRemaining } from '../../utils/time'
import { Home, CheckSquare, Map, Lightbulb, Settings, MoreVertical, X, Layers, Eye, LogOut } from 'lucide-react'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/brainstorm', label: 'Ideas' },
  { to: '/board', label: 'Board' },
  { to: '/settings', label: 'Settings' },
]

const bottomNavLinks = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/roadmap', icon: Map, label: 'Map' },
  { to: '/brainstorm', icon: Lightbulb, label: 'Ideas' },
]

const moreNavLinks = [
  { to: '/board', icon: Layers, label: 'Board' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

function ProfileMenu() {
  const navigate = useNavigate()
  const clearTeam = useUiStore((state) => state.clearTeam)
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    localStorage.removeItem('onboarding_completed')
    clearTeam()
    navigate('/')
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-center rounded-lg border-2 border-black bg-white p-2 transition-colors hover:bg-gray-100">
        <Eye className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border-2 border-black bg-white p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm font-medium hover:bg-red-100 transition-colors">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

function MobileHeader() {
  const { team } = useUiStore()
  const timeLeft = getTimeRemaining(team.endsAt)

  return (
    <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b-2 border-black bg-white px-3 md:hidden">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-black text-white font-bold text-sm">
          H
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-[#ffd9f3] px-2 py-1 text-xs font-bold border-2 border-black">
          <Home className="h-3 w-3" />
          <span className="whitespace-nowrap">{timeLeft}</span>
        </div>
        <ProfileMenu />
      </div>
    </header>
  )
}

function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t-2 border-black bg-white md:hidden px-0">
        {bottomNavLinks.map((link) => {
          const Icon = link.icon
          const isActive = location.pathname === link.to
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all border-2 mx-0.5 rounded-lg ${
                isActive
                  ? 'border-black bg-[#c7ff66] text-black font-bold'
                  : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
              <span className="text-[10px] font-bold">{link.label}</span>
            </NavLink>
          )
        })}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all border-2 mx-0.5 rounded-lg ${
            moreOpen
              ? 'border-black bg-[#ffd9f3] text-black font-bold'
              : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
          }`}
        >
          <MoreVertical className="h-5 w-5" strokeWidth={2} />
          <span className="text-[10px] font-bold">More</span>
        </button>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 md:hidden" onClick={() => setMoreOpen(false)} />
      )}

      {moreOpen && (
        <div className="fixed bottom-20 left-0 right-0 z-50 mx-2 mb-2 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:hidden overflow-hidden">
          <div className="flex items-center justify-between border-b-2 border-black px-4 py-3">
            <h3 className="font-bold text-sm">More Options</h3>
            <button
              onClick={() => setMoreOpen(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="divide-y-2 divide-black">
            {moreNavLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.to
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMoreOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive ? 'bg-[#c7ff66] font-bold' : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  <span className="text-sm font-medium">{link.label}</span>
                </NavLink>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export function WorkspaceLayout() {
  const session = useSession()
  const location = useLocation()
  const isOnboarding = location.pathname === '/onboarding'

  return (
    <div className="page-shell">
      {!isOnboarding && <MobileHeader />}
      <div className={`mx-auto flex min-h-screen max-w-7xl flex-col px-3 py-3 md:px-6 md:py-4 ${!isOnboarding ? 'pb-20 md:pb-4 pt-12 md:pt-4' : ''}`}>
        <header className="brutal-card mb-6 hidden flex-wrap items-center justify-between gap-4 p-4 md:flex">
          <BrandMark />
          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex flex-wrap gap-3">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className="nav-link">
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <LivePill text={session.data?.email ?? 'Realtime sync ready'} />
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
        {!isOnboarding && <BottomNav />}
      </div>
    </div>
  )
}
