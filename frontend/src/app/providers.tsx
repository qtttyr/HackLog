import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { queryClient } from '../lib/query-client'
import { supabase } from '../lib/supabase'

function AuthListener({ children }: PropsWithChildren) {
  useEffect(() => {
    // Listen for auth state changes and invalidate session query
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      // When auth state changes, invalidate the session query to refetch
      queryClient.invalidateQueries({ queryKey: ['session'] })
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

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
