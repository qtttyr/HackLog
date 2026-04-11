import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { queryClient } from '../lib/query-client'
import { supabase } from '../lib/supabase'
import { useUiStore } from '../store/ui-store'

function AuthListener({ children }: PropsWithChildren) {
  const setIsOnboarded = useUiStore((state) => state.setIsOnboarded)

  useEffect(() => {
    // Initialize onboarding state from localStorage on app startup
    const onboardingCompleted = localStorage.getItem('onboarding_completed')
    if (onboardingCompleted === 'true') {
      setIsOnboarded(true)
    }

    // Listen for auth state changes and invalidate session query immediately
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] State changed:', event, 'Session available:', !!session)
      
      // Invalidate and refetch the session query immediately
      queryClient.invalidateQueries({ queryKey: ['session'] })
      
      // Force an immediate refetch
      queryClient.refetchQueries({ queryKey: ['session'] })
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [setIsOnboarded])

  return <>{children}</>
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthListener>{children}</AuthListener>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
