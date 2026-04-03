export function getTimeRemaining(endsAt: string) {
  const delta = new Date(endsAt).getTime() - Date.now()
  const total = Math.max(delta, 0)
  const hours = Math.floor(total / 3_600_000)
  const minutes = Math.floor((total % 3_600_000) / 60_000)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}
