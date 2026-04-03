import { useQuery } from '@tanstack/react-query'
import type { HealthResponse } from '../types/api'
import { apiFetch } from '../utils/api'

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiFetch<HealthResponse>('/api/health'),
  })
}
