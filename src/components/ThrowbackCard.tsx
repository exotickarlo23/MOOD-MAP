'use client'

import Link from 'next/link'
import type { MoodEntry } from '@/lib/supabase'
import { MOODS, normalizeMood } from '@/lib/moods'
import MoodIcon from '@/components/MoodIcon'

interface ThrowbackCardProps {
  entries: MoodEntry[]
}

function findThrowback(entries: MoodEntry[]): { entry: MoodEntry; label: string } | null {
  const now = new Date()
  const today = now.getDate()
  const month = now.getMonth()
  const year = now.getFullYear()

  // Check intervals: 7 days, 30 days, 90 days, 365 days (prefer oldest)
  const intervals = [
    { days: 365, label: 'Prije godinu dana' },
    { days: 90, label: 'Prije 3 mjeseca' },
    { days: 30, label: 'Prije mjesec dana' },
    { days: 7, label: 'Prije tjedan dana' },
  ]

  for (const { days, label } of intervals) {
    const target = new Date(year, month, today)
    target.setDate(target.getDate() - days)

    // Allow ±1 day tolerance for longer intervals
    const tolerance = days >= 30 ? 1 : 0

    const match = entries.find((e) => {
      const entryDate = new Date(e.created_at)
      const diffMs = Math.abs(entryDate.getTime() - target.getTime())
      const diffDays = diffMs / 86400000
      return diffDays <= tolerance + 0.5
    })

    if (match) return { entry: match, label }
  }

  return null
}

export default function ThrowbackCard({ entries }: ThrowbackCardProps) {
  const throwback = findThrowback(entries)

  if (!throwback) return null

  const { entry, label } = throwback
  const mood = normalizeMood(entry.mood)
  const moodConfig = MOODS[mood]
  const date = new Date(entry.created_at)
  const dateStr = date.toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Link href={`/entry/${entry.id}`}>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-sm mb-4">
        <div className="mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Sjećaš se?
          </span>
        </div>
        <p className="text-gray-500 text-xs mb-3">{label} &middot; {dateStr}</p>
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <MoodIcon mood={mood} size={36} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm text-gray-800">{moodConfig.label}</p>
            {entry.story && (
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {entry.story}
              </p>
            )}
          </div>
          <span className="text-gray-300 text-sm">→</span>
        </div>
      </div>
    </Link>
  )
}
