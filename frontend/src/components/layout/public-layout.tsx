import { NavLink, Outlet } from 'react-router-dom'
import { BrandMark } from '../ui/brand-mark'

const links = [
  { to: '/', label: 'Home' },
  { to: '/auth', label: 'Login' },
]

export function PublicLayout() {
  return (
    <div className="page-shell">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 md:px-6">
        <header className="brutal-card mb-6 flex flex-wrap items-center justify-between gap-4 p-4">
          <BrandMark />
          <nav className="flex flex-wrap gap-3">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className="nav-link">
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
