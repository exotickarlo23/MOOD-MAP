'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase, type MoodEntry } from '@/lib/supabase'
import { normalizeMood } from '@/lib/moods'

interface Badge {
  id: string
  title: string
  description: string
  earned: boolean
}

const BADGE_IMAGES: Record<string, string> = {
  'prvi-korak': '/badges/prvi-korak.png',
  'streak-3': '/badges/streak-3.png',
  'streak-7': '/badges/streak-7.png',
  'streak-14': '/badges/streak-14.png',
  'streak-30': '/badges/streak-30.png',
  'entries-10': '/badges/entries-10.png',
  'entries-50': '/badges/entries-50.png',
  'entries-100': '/badges/entries-100.png',
  'mood-explorer': '/badges/mood-explorer.png',
  'storyteller': '/badges/storyteller.png',
  'early-bird': '/badges/early-bird.png',
  'night-owl': '/badges/night-owl.png',
  'comeback': '/badges/comeback.png',
  'seasonal': '/badges/seasonal.png',
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)
      const entries = data || []
      computeBadges(entries)
      setLoading(false)
    }
    load()
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

    // New badge calculations
    const uniqueMoods = new Set(entries.map((e) => normalizeMood(e.mood))).size
    const entriesWithStory = entries.filter((e) => e.story?.trim()).length
    const hasEarlyEntry = entries.some((e) => new Date(e.created_at).getHours() < 8)
    const hasLateEntry = entries.some((e) => new Date(e.created_at).getHours() >= 22)

    // Comeback: gap of 7+ days then a new entry
    let hasComeback = false
    for (let i = 1; i < sortedDays.length; i++) {
      const diff = (sortedDays[i].getTime() - sortedDays[i - 1].getTime()) / 86400000
      if (diff >= 7) { hasComeback = true; break }
    }

    // Seasonal: check entries across all 4 seasons
    const seasons = new Set(
      entries.map((e) => {
        const month = new Date(e.created_at).getMonth()
        if (month >= 2 && month <= 4) return 'spring'
        if (month >= 5 && month <= 7) return 'summer'
        if (month >= 8 && month <= 10) return 'autumn'
        return 'winter'
      })
    )

    setBadges([
      {
        id: 'prvi-korak',
        title: 'Prvi korak',
        description: 'Upiši svoj prvi unos',
        earned: total >= 1,
      },
      {
        id: 'streak-3',
        title: '3 dana zaredom',
        description: 'Održi streak od 3 dana',
        earned: longestStreak >= 3,
      },
      {
        id: 'streak-7',
        title: 'Tjedan dana',
        description: '7 dana zaredom pisanja',
        earned: longestStreak >= 7,
      },
      {
        id: 'streak-14',
        title: 'Dva tjedna',
        description: '14 dana zaredom pisanja',
        earned: longestStreak >= 14,
      },
      {
        id: 'streak-30',
        title: 'Mjesec dana',
        description: '30 dana zaredom',
        earned: longestStreak >= 30,
      },
      {
        id: 'entries-10',
        title: '10 unosa',
        description: 'Upiši ukupno 10 unosa',
        earned: total >= 10,
      },
      {
        id: 'entries-50',
        title: '50 unosa',
        description: 'Upiši ukupno 50 unosa',
        earned: total >= 50,
      },
      {
        id: 'entries-100',
        title: '100 unosa',
        description: 'Upiši ukupno 100 unosa',
        earned: total >= 100,
      },
      {
        id: 'mood-explorer',
        title: 'Mood Explorer',
        description: 'Zabilježi svih 5 raspoloženja',
        earned: uniqueMoods >= 5,
      },
      {
        id: 'storyteller',
        title: 'Zlatni Niz',
        description: 'Napiši 20 priča uz unose',
        earned: entriesWithStory >= 20,
      },
      {
        id: 'early-bird',
        title: 'Rano Ustajanje',
        description: 'Upiši unos prije 8 ujutro',
        earned: hasEarlyEntry,
      },
      {
        id: 'night-owl',
        title: 'Noćna Ptica',
        description: 'Upiši unos nakon 22h',
        earned: hasLateEntry,
      },
      {
        id: 'comeback',
        title: 'Povratak',
        description: 'Vrati se nakon 7+ dana pauze',
        earned: hasComeback,
      },
      {
        id: 'seasonal',
        title: 'Sezonski Dnevničar',
        description: 'Unosi u sva 4 godišnja doba',
        earned: seasons.size >= 4,
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
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-2xl p-4 text-center transition-all ${
              badge.earned
                ? 'bg-white/80 backdrop-blur-sm shadow-sm'
                : 'bg-gray-100/50 opacity-40 grayscale'
            }`}
          >
            <div className="flex justify-center mb-3">
              <Image
                src={BADGE_IMAGES[badge.id]}
                alt={badge.title}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">{badge.title}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
