import { NavLink, Outlet } from 'react-router-dom'
import { BrandMark } from '../ui/brand-mark'

export function PublicLayout() {
  return (
    <div className="page-shell">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 md:px-6">
        <header className="brutal-card mb-6 flex items-center justify-between gap-4 p-4">
          <BrandMark />
          <nav className="flex gap-2 md:gap-3">
            <NavLink to="/auth" className="nav-link text-sm md:text-base">Login</NavLink>
          </nav>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
