export interface Mission {
  title: string
  content: string[]
}

export const FALLBACK_MISSIONS: Mission[] = [
  {
    title: '1. Fast for 24 hours',
    content: [
      'Hunger exposes who is in control.',
      'Your body will beg. Your mind will negotiate.',
      'Watch how quickly excuses appear.',
      'Discipline begins when you refuse them.',
    ],
  },
  {
    title: '2. Wake before the sun',
    content: [
      'The morning belongs to no one yet.',
      'Rise before the world makes its demands.',
      'An hour of silence is worth three of noise.',
      'What you do first shapes everything after.',
    ],
  },
  {
    title: '3. Carry something heavy',
    content: [
      'Comfort is the enemy of growth.',
      'Load the bar. Walk the distance. Feel the weight.',
      'The body learns what the mind resists.',
      'Strength is built where ease is abandoned.',
    ],
  },
]

export async function generateMissions(token?: string | null): Promise<Mission[]> {
  const res = await fetch('/api/missions/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) throw new Error('Failed to generate missions')
  return res.json()
}
