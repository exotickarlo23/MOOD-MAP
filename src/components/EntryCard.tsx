import Link from 'next/link'
import { MOODS, type MoodType, normalizeMood } from '@/lib/moods'
import type { MoodEntry } from '@/lib/supabase'
import MoodIcon from '@/components/MoodIcon'

interface EntryCardProps {
  entry: MoodEntry
}

export default function EntryCard({ entry }: EntryCardProps) {
  const moodKey = normalizeMood(entry.mood)
  const mood = MOODS[moodKey]
  if (!mood) return null

  const date = new Date(entry.created_at)
  const timeAgo = getTimeAgo(date)

  return (
    <Link href={`/entry/${entry.id}`}>
      <div className={`p-4 rounded-2xl bg-gradient-to-r ${mood.gradient} hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer`}>
        <div className="flex items-start gap-3">
          <MoodIcon mood={moodKey} size={40} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">{mood.label}</h3>
              <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>
            {entry.story && (
              <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{entry.story}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'upravo'
  if (diffMins < 60) return `prije ${diffMins}m`
  if (diffHours < 24) return `prije ${diffHours}h`
  if (diffDays < 7) return `prije ${diffDays}d`
  return date.toLocaleDateString('hr')
}
