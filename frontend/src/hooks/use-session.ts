import { useQuery } from '@tanstack/react-query'
import type { VerifyResponse } from '../types/api'
import { supabase } from '../lib/supabase'
import { apiFetch } from '../utils/api'

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) return null
      
      // Try to verify with backend, but gracefully fallback if backend is unavailable
      try {
        return await apiFetch<VerifyResponse>('/api/auth/verify', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch (error) {
        // If backend is unavailable, use session info from Supabase auth
        const user = data.session?.user
        if (user) {
          return {
            id: user.id,
            email: user.email ?? 'User',
            is_valid: true,
          }
        }
        return null
      }
    },
    retry: 1, // Only retry once to avoid repeated errors
    staleTime: 60000, // Cache for 1 minute
  })
}
