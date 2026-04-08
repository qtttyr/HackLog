import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PublicLayout } from '../components/layout/public-layout'
import { WorkspaceLayout } from '../components/layout/workspace-layout'
import { AuthPage } from '../features/auth/auth-page'
import { LandingPage } from '../features/landing/landing-page'
import { BoardPage } from '../features/board/board-page'
import { DashboardPage } from '../features/dashboard/dashboard-page'
import { OnboardingPage } from '../features/onboarding/onboarding-page'
import { TasksPage } from '../features/tasks/tasks-page'
import { RoadmapPage } from '../features/roadmap/roadmap-page'
import { BrainstormPage } from '../features/brainstorm/brainstorm-page'
import { SettingsPage } from '../features/settings/settings-page'
import { useSession } from '../hooks/use-session'

function RootRoute() {
  const { data: session, isLoading } = useSession()

  if (isLoading) {
    return null
  }

  // If not logged in, go to landing
  if (!session) {
    return <Navigate to="/" replace />
  }

  // If logged in, check onboarding
  const onboardingCompleted = localStorage.getItem('onboarding_completed')
  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />
  }

  // If logged in and onboarded, go to dashboard
  return <Navigate to="/dashboard" replace />
}

function ProtectedRoute() {
  const { data: session, isLoading } = useSession()

  if (isLoading) {
    return null
  }

  if (!session) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

function OnboardingGuard() {
  const { data: session, isLoading } = useSession()

  if (isLoading) {
    return null
  }

  if (session) {
    const onboardingCompleted = localStorage.getItem('onboarding_completed')
    if (!onboardingCompleted) {
      return <Navigate to="/onboarding" replace />
    }
  }

  return <Outlet />
}

export function AppRouter() {
  return (
    <Routes>
      {/* Smart root redirect - redirects based on session */}
      <Route index element={<RootRoute />} />

      {/* Public routes for non-authenticated users */}
      <Route element={<PublicLayout />}>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<WorkspaceLayout />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route element={<OnboardingGuard />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/brainstorm" element={<BrainstormPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch all - redirect to root */}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}
