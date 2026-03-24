export type MoodType = 'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'excited' | 'neutral'

export interface MoodConfig {
  label: string
  emoji: string
  color: string
  bg: string
  gradient: string
}

export const MOODS: Record<MoodType, MoodConfig> = {
  happy: {
    label: 'Happy',
    emoji: '😊',
    color: '#FFD700',
    bg: 'bg-yellow-100',
    gradient: 'from-yellow-200 to-orange-100',
  },
  sad: {
    label: 'Sad',
    emoji: '😢',
    color: '#6B8DD6',
    bg: 'bg-blue-100',
    gradient: 'from-blue-200 to-indigo-100',
  },
  angry: {
    label: 'Angry',
    emoji: '😠',
    color: '#FF6B6B',
    bg: 'bg-red-100',
    gradient: 'from-red-200 to-pink-100',
  },
  anxious: {
    label: 'Anxious',
    emoji: '😰',
    color: '#DDA0DD',
    bg: 'bg-purple-100',
    gradient: 'from-purple-200 to-pink-100',
  },
  calm: {
    label: 'Calm',
    emoji: '😌',
    color: '#90EE90',
    bg: 'bg-green-100',
    gradient: 'from-green-200 to-emerald-100',
  },
  excited: {
    label: 'Excited',
    emoji: '🤩',
    color: '#FF8C00',
    bg: 'bg-orange-100',
    gradient: 'from-orange-200 to-amber-100',
  },
  neutral: {
    label: 'Neutral',
    emoji: '😐',
    color: '#C0C0C0',
    bg: 'bg-gray-100',
    gradient: 'from-gray-200 to-slate-100',
  },
}

export const MOOD_KEYS = Object.keys(MOODS) as MoodType[]
