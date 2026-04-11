// Phase 1: Backend is optional. Only use backend if explicitly configured.
// If VITE_API_BASE_URL is not set, backend calls will fail gracefully in useSession hook
const baseUrl = import.meta.env.VITE_API_BASE_URL

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!baseUrl) {
    throw new Error('Backend not configured (Phase 1: Supabase auth only)')
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json() as Promise<T>
}
