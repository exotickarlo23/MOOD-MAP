import { MOODS, type MoodType } from '@/lib/moods'

interface MoodBadgeProps {
  mood: string
  size?: 'sm' | 'md' | 'lg'
}

export default function MoodBadge({ mood, size = 'md' }: MoodBadgeProps) {
  const config = MOODS[mood as MoodType]
  if (!config) return null

  const sizes = {
    sm: 'text-lg px-2 py-1',
    md: 'text-2xl px-3 py-1.5',
    lg: 'text-4xl px-4 py-2',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${config.bg} ${sizes[size]}`}>
      <span>{config.emoji}</span>
      <span className={`font-medium text-gray-700 ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
        {config.label}
      </span>
    </span>
  )
}
