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
      return apiFetch<VerifyResponse>('/api/auth/verify', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    },
  })
}
