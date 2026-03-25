'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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

    // Check for unique moods
    const uniqueMoods = new Set(entries.map((e) => e.mood))

    // Check for night entries (22:00 - 04:00)
    const hasNightEntry = entries.some((e) => {
      const hour = new Date(e.created_at).getHours()
      return hour >= 22 || hour < 4
    })

    // Check for early morning entries (05:00 - 07:00)
    const hasEarlyEntry = entries.some((e) => {
      const hour = new Date(e.created_at).getHours()
      return hour >= 5 && hour <= 7
    })

    // Check for seasonal entries (entries in different months/seasons)
    const seasons = new Set(
      entries.map((e) => {
        const month = new Date(e.created_at).getMonth()
        if (month <= 1 || month === 11) return 'winter'
        if (month <= 4) return 'spring'
        if (month <= 7) return 'summer'
        return 'autumn'
      })
    )

    // Check for comeback (gap of 7+ days then new entry)
    let hasComeback = false
    for (let i = 1; i < sortedDays.length; i++) {
      const diff = (sortedDays[i].getTime() - sortedDays[i - 1].getTime()) / 86400000
      if (diff >= 7) { hasComeback = true; break }
    }

    setBadges([
      {
        icon: '/BADGES/PRVI%20KORAK.png',
        title: 'Prvi korak',
        description: 'Upiši svoj prvi unos',
        earned: total >= 1,
      },
      {
        icon: '/BADGES/3%20DANA.png',
        title: '3 dana zaredom',
        description: 'Održi streak od 3 dana',
        earned: longestStreak >= 3,
      },
      {
        icon: '/BADGES/TJEDAN%20DANA.png',
        title: 'Tjedan dana',
        description: '7 dana zaredom pisanja',
        earned: longestStreak >= 7,
      },
      {
        icon: '/BADGES/DVA%20TJEDNA.png',
        title: 'Dva tjedna',
        description: '14 dana zaredom pisanja',
        earned: longestStreak >= 14,
      },
      {
        icon: '/BADGES/MJESEC%20DANA.png',
        title: 'Mjesec dana',
        description: '30 dana zaredom',
        earned: longestStreak >= 30,
      },
      {
        icon: '/BADGES/ZLATNI%20NIZ.png',
        title: 'Zlatni niz',
        description: '21 dan zaredom pisanja',
        earned: longestStreak >= 21,
      },
      {
        icon: '/BADGES/10%20UNOSA.png',
        title: '10 unosa',
        description: 'Upiši ukupno 10 unosa',
        earned: total >= 10,
      },
      {
        icon: '/BADGES/50%20UNOSA.png',
        title: '50 unosa',
        description: 'Upiši ukupno 50 unosa',
        earned: total >= 50,
      },
      {
        icon: '/BADGES/100%20UNOSA.png',
        title: '100 unosa',
        description: 'Upiši ukupno 100 unosa',
        earned: total >= 100,
      },
      {
        icon: '/BADGES/MOOD%20EXPLORER.png',
        title: 'Mood Explorer',
        description: 'Zabilježi 5 različitih raspoloženja',
        earned: uniqueMoods.size >= 5,
      },
      {
        icon: '/BADGES/NO%C4%86NA%20PTICA.png',
        title: 'Noćna ptica',
        description: 'Upiši unos između 22h i 4h',
        earned: hasNightEntry,
      },
      {
        icon: '/BADGES/RANO%20USTAJANJE.png',
        title: 'Rano ustajanje',
        description: 'Upiši unos između 5h i 7h',
        earned: hasEarlyEntry,
      },
      {
        icon: '/BADGES/POVRATAK.png',
        title: 'Povratak',
        description: 'Vrati se nakon pauze od 7+ dana',
        earned: hasComeback,
      },
      {
        icon: '/BADGES/SEZONSKI%20DNEVNI%C4%8CAR.png',
        title: 'Sezonski dnevničar',
        description: 'Upiši unose u barem 3 sezone',
        earned: seasons.size >= 3,
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
                : 'bg-gray-100/50 opacity-50 grayscale'
            }`}
          >
            <div className="flex justify-center mb-2">
              <Image
                src={badge.icon}
                alt={badge.title}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">{badge.title}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
