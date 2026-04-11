import { useQuery } from '@tanstack/react-query'
import type { VerifyResponse } from '../types/api'
import { supabase } from '../lib/supabase'
import { apiFetch } from '../utils/api'

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('[useSession] Session error:', error)
          return null
        }
        
        const token = data.session?.access_token
        if (!token) {
          console.log('[useSession] No token available')
          return null
        }
        
        console.log('[useSession] Token found, verifying with backend...')
        
        // Try to verify with backend, but gracefully fallback if backend is unavailable
        try {
          return await apiFetch<VerifyResponse>('/api/auth/verify', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          })
        } catch (backendError) {
          console.warn('[useSession] Backend verification failed, using Supabase session:', backendError)
          // If backend is unavailable, use session info from Supabase auth
          const user = data.session?.user
          if (user && user.email) {
            console.log('[useSession] Using Supabase session for user:', user.email)
            return {
              id: user.id,
              email: user.email,
              is_valid: true,
            }
          }
          return null
        }
      } catch (err) {
        console.error('[useSession] Session fetch error:', err)
        return null
      }
    },
    retry: 1,
    staleTime: 0,  // Don't cache - always fresh
    gcTime: 0,     // Don't keep in memory when not in use
  })
}
