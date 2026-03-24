import { MOODS, type MoodType, normalizeMood } from '@/lib/moods'
import MoodIcon from '@/components/MoodIcon'

interface MoodBadgeProps {
  mood: string
  size?: 'sm' | 'md' | 'lg'
}

export default function MoodBadge({ mood, size = 'md' }: MoodBadgeProps) {
  const moodKey = normalizeMood(mood)
  const config = MOODS[moodKey]
  if (!config) return null

  const iconSizes = { sm: 24, md: 32, lg: 48 }
  const paddings = { sm: 'px-2 py-1', md: 'px-3 py-1.5', lg: 'px-4 py-2' }
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${config.bg} ${paddings[size]}`}>
      <MoodIcon mood={moodKey} size={iconSizes[size]} />
      <span className={`font-medium text-gray-700 ${textSizes[size]}`}>
        {config.label}
      </span>
    </span>
  )
}
