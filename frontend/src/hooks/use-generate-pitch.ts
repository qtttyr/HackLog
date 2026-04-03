import { useMutation } from '@tanstack/react-query'
import type { GenerateResponse } from '../types/api'
import { supabase } from '../lib/supabase'
import { apiFetch } from '../utils/api'

export function useGeneratePitch(path: '/api/pitch/generate' | '/api/readme/generate') {
  return useMutation({
    mutationFn: async (teamId: string) => {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token ?? ''
      return apiFetch<GenerateResponse>(path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ team_id: teamId }),
      })
    },
  })
}
