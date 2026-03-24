export type MoodType = 'odlicno' | 'dobro' | 'okej' | 'lose' | 'uzasno'

export interface MoodConfig {
  label: string
  emoji: string
  color: string
  bg: string
  gradient: string
  intensity: number
}

export const MOODS: Record<MoodType, MoodConfig> = {
  odlicno: {
    label: 'Odlično',
    emoji: '💖',
    color: '#F472B6',
    bg: 'bg-pink-100',
    gradient: 'from-pink-200 to-rose-100',
    intensity: 10,
  },
  dobro: {
    label: 'Dobro',
    emoji: '😊',
    color: '#F4A77A',
    bg: 'bg-orange-100',
    gradient: 'from-orange-200 to-amber-100',
    intensity: 8,
  },
  okej: {
    label: 'Okej',
    emoji: '😐',
    color: '#94A3B8',
    bg: 'bg-slate-100',
    gradient: 'from-slate-200 to-gray-100',
    intensity: 5,
  },
  lose: {
    label: 'Loše',
    emoji: '😢',
    color: '#A78BFA',
    bg: 'bg-purple-100',
    gradient: 'from-purple-200 to-violet-100',
    intensity: 3,
  },
  uzasno: {
    label: 'Užasno',
    emoji: '😭',
    color: '#E2C97E',
    bg: 'bg-yellow-100',
    gradient: 'from-yellow-200 to-amber-100',
    intensity: 1,
  },
}

export const MOOD_KEYS = Object.keys(MOODS) as MoodType[]

// Map old mood keys to new ones for backward compatibility
export function normalizeMood(mood: string): MoodType {
  const oldToNew: Record<string, MoodType> = {
    happy: 'odlicno',
    excited: 'odlicno',
    calm: 'dobro',
    neutral: 'okej',
    anxious: 'lose',
    sad: 'lose',
    angry: 'uzasno',
  }
  if (mood in MOODS) return mood as MoodType
  return oldToNew[mood] || 'okej'
}
