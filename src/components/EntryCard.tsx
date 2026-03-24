import Link from 'next/link'
import { MOODS, type MoodType } from '@/lib/moods'
import type { MoodEntry } from '@/lib/supabase'

interface EntryCardProps {
  entry: MoodEntry
}

export default function EntryCard({ entry }: EntryCardProps) {
  const mood = MOODS[entry.mood as MoodType]
  if (!mood) return null

  const date = new Date(entry.created_at)
  const timeAgo = getTimeAgo(date)

  return (
    <Link href={`/entry/${entry.id}`}>
      <div className={`p-4 rounded-2xl bg-gradient-to-r ${mood.gradient} hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer`}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{mood.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">{mood.label}</h3>
              <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i < entry.intensity ? 'opacity-100' : 'opacity-20'
                    }`}
                    style={{ backgroundColor: mood.color }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">{entry.intensity}/10</span>
            </div>
            {entry.story && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{entry.story}</p>
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

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}
