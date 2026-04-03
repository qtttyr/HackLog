import { NavLink, Outlet } from 'react-router-dom'
import { BrandMark } from '../ui/brand-mark'
import { LivePill } from '../ui/live-pill'
import { useSession } from '../../hooks/use-session'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/board', label: 'Board' },
  { to: '/decisions', label: 'Decisions' },
  { to: '/pitch', label: 'Pitch' },
]

const bottomNavLinks = [
  { to: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard' },
  { to: '/board', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', label: 'Board' },
  { to: '/decisions', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Decisions' },
  { to: '/pitch', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', label: 'Pitch' },
]

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t-2 border-black bg-white px-2 py-3 md:hidden">
      {bottomNavLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-lg p-2 transition-colors ${isActive ? 'bg-[#c7ff66]' : 'hover:bg-gray-100'}`
          }
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
          </svg>
          <span className="text-[10px] font-medium">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function WorkspaceLayout() {
  const session = useSession()
  return (
    <div className="page-shell">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 md:px-6 pb-20 md:pb-4">
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
        <BottomNav />
      </div>
    </div>
  )
}
