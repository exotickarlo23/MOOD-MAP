'use client'

import { useState, useEffect } from 'react'
import { getAllEntries, type MoodEntry } from '@/lib/moodStorage'

interface Badge {
  icon: string
  title: string
  description: string
  earned: boolean
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const entries = getAllEntries(200)
    computeBadges(entries)
    setLoading(false)
  }, [])

  function computeBadges(entries: MoodEntry[]) {
    const uniqueDays = new Set(
      entries.map((e) => new Date(e.created_at).toDateString())
    )
    const total = uniqueDays.size

    // Calculate streak
    let longestStreak = 0
    const sortedDays = Array.from(uniqueDays)
      .map((s) => new Date(s))
      .sort((a, b) => a.getTime() - b.getTime())
    let run = 1
    for (let i = 1; i < sortedDays.length; i++) {
      const diff = (sortedDays[i].getTime() - sortedDays[i - 1].getTime()) / 86400000
      if (diff === 1) run++
      else { longestStreak = Math.max(longestStreak, run); run = 1 }
    }
    longestStreak = Math.max(longestStreak, run)

    setBadges([
      {
        icon: '\u{1F331}',
        title: 'Prvi korak',
        description: 'Upiši svoj prvi unos',
        earned: total >= 1,
      },
      {
        icon: '\u{1F525}',
        title: '3 dana zaredom',
        description: 'Održi streak od 3 dana',
        earned: longestStreak >= 3,
      },
      {
        icon: '\u{2B50}',
        title: 'Tjedan dana',
        description: '7 dana zaredom pisanja',
        earned: longestStreak >= 7,
      },
      {
        icon: '\u{1F3C6}',
        title: 'Dva tjedna',
        description: '14 dana zaredom pisanja',
        earned: longestStreak >= 14,
      },
      {
        icon: '\u{1F48E}',
        title: 'Mjesec dana',
        description: '30 dana zaredom',
        earned: longestStreak >= 30,
      },
      {
        icon: '\u{1F4DA}',
        title: '10 unosa',
        description: 'Upiši ukupno 10 unosa',
        earned: total >= 10,
      },
      {
        icon: '\u{1F680}',
        title: '50 unosa',
        description: 'Upiši ukupno 50 unosa',
        earned: total >= 50,
      },
      {
        icon: '\u{1F451}',
        title: '100 unosa',
        description: 'Upiši ukupno 100 unosa',
        earned: total >= 100,
      },
    ])
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    )
  }

  const earned = badges.filter((b) => b.earned).length

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">Badges</h1>
      <p className="text-center text-gray-400 text-sm mb-5">
        {earned}/{badges.length} osvojeno
      </p>

      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 text-center transition-all ${
              badge.earned
                ? 'bg-white/80 shadow-sm'
                : 'bg-gray-100/50 opacity-50'
            }`}
          >
            <span className="text-3xl block mb-2">{badge.icon}</span>
            <h3 className="font-semibold text-gray-800 text-sm">{badge.title}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
