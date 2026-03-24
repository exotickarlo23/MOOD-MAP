'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, type MoodEntry } from '@/lib/supabase'
import { MOODS, MOOD_KEYS, type MoodType, normalizeMood } from '@/lib/moods'
import MoodIcon from '@/components/MoodIcon'
import MoodStoryFlow from '@/components/MoodStoryFlow'

const DAY_NAMES_SHORT = ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub']

function getWeekDays() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))

  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push({
      name: DAY_NAMES_SHORT[d.getDay()],
      date: d,
      isToday: d.toDateString() === today.toDateString(),
    })
  }
  return days
}

// Animated mood carousel for the landing
function AnimatedMoods() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % MOOD_KEYS.length)
        setFade(true)
      }, 400)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const currentMood = MOOD_KEYS[activeIndex]

  return (
    <div className="flex flex-col items-center">
      {/* Background moods - faded */}
      <div className="flex items-center gap-3 mb-4">
        {MOOD_KEYS.map((key, i) => {
          const isActive = i === activeIndex
          return (
            <div
              key={key}
              className="transition-all duration-500 ease-out"
              style={{
                opacity: isActive ? 1 : 0.2,
                transform: isActive ? 'scale(1.3) translateY(-8px)' : 'scale(0.8)',
                filter: isActive ? 'none' : 'grayscale(0.5)',
              }}
            >
              <MoodIcon mood={key} size={isActive ? 72 : 44} />
            </div>
          )
        })}
      </div>

      {/* Mood label */}
      <p
        className="text-lg font-semibold text-gray-700 transition-all duration-400"
        style={{
          opacity: fade ? 1 : 0,
          transform: fade ? 'translateY(0)' : 'translateY(8px)',
        }}
      >
        {MOODS[currentMood].label}
      </p>
    </div>
  )
}

export default function HomePage() {
  const [showFlow, setShowFlow] = useState(false)
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null)
  const [weekEntries, setWeekEntries] = useState<MoodEntry[]>([])
  const [streak, setStreak] = useState({ current: 0, longest: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const { data: entries } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      const allEntries = entries || []

      // Check today's entry
      const today = new Date().toDateString()
      const existing = allEntries.find(
        (e: MoodEntry) => new Date(e.created_at).toDateString() === today
      )
      setTodayEntry(existing || null)

      // This week
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7))
      weekStart.setHours(0, 0, 0, 0)
      setWeekEntries(
        allEntries.filter((e: MoodEntry) => new Date(e.created_at) >= weekStart)
      )

      // Streak
      calculateStreak(allEntries)
    } catch {
      // silently handle
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  function calculateStreak(entries: MoodEntry[]) {
    if (entries.length === 0) {
      setStreak({ current: 0, longest: 0, total: 0 })
      return
    }

    const uniqueDays = new Set(
      entries.map((e: MoodEntry) => new Date(e.created_at).toDateString())
    )
    const total = uniqueDays.size

    let current = 0
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    while (uniqueDays.has(d.toDateString())) {
      current++
      d.setDate(d.getDate() - 1)
    }

    const sortedDays = Array.from(uniqueDays)
      .map((s) => new Date(s))
      .sort((a, b) => a.getTime() - b.getTime())
    let longest = 0
    let run = 1
    for (let i = 1; i < sortedDays.length; i++) {
      const diff = (sortedDays[i].getTime() - sortedDays[i - 1].getTime()) / 86400000
      if (diff === 1) run++
      else { longest = Math.max(longest, run); run = 1 }
    }
    longest = Math.max(longest, run)

    setStreak({ current, longest, total })
  }

  function handleFlowComplete() {
    setShowFlow(false)
    loadData()
  }

  const weekDays = getWeekDays()
  const weekCount = weekEntries.length

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    )
  }

  // Story flow overlay
  if (showFlow) {
    return (
      <MoodStoryFlow
        todayEntry={todayEntry}
        onComplete={handleFlowComplete}
        onClose={() => setShowFlow(false)}
      />
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-4">
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Mood Map
        </h1>
        <p className="text-gray-400 text-sm italic mt-0.5">tvoj dnevni mikro-dnevnik</p>
      </div>

      {/* Hero section: Animated moods + CTA */}
      <div className="flex flex-col items-center justify-center py-10">
        <AnimatedMoods />

        <button
          onClick={() => setShowFlow(true)}
          className="mt-10 w-full max-w-xs py-4 px-8 rounded-2xl font-bold text-lg bg-gray-800 text-white hover:bg-gray-700 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-gray-800/20"
        >
          {todayEntry ? 'Ažuriraj svoj dan' : 'Kako si danas?'}
        </button>

        {todayEntry && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <MoodIcon mood={normalizeMood(todayEntry.mood)} size={20} />
            <span>Danas: {MOODS[normalizeMood(todayEntry.mood)].label}</span>
          </div>
        )}
      </div>

      {/* Weekly Insight Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-sm mb-4">
        <div className="mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Tjedni uvid
          </span>
        </div>
        <p className="text-gray-700 font-medium text-sm mb-3">
          {weekCount === 0
            ? 'Započni ovaj tjedan — upiši prvi unos!'
            : weekCount === 7
              ? 'Savršen tjedan! Svaki dan upisan!'
              : `${weekCount} ${weekCount === 1 ? 'unos' : 'unosa'} ovaj tjedan — nastavi!`}
        </p>
        <div className="flex items-center gap-1.5">
          {weekDays.map((day, i) => {
            const entryForDay = weekEntries.find(
              (e) => new Date(e.created_at).toDateString() === day.date.toDateString()
            )
            return (
              <div key={i} className="flex flex-col items-center flex-1">
                <span className="text-[10px] text-gray-400 mb-1">{day.name}</span>
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    day.isToday
                      ? 'bg-gray-700 text-white'
                      : entryForDay
                        ? 'bg-gray-100'
                        : 'bg-gray-50'
                  }`}
                >
                  {entryForDay ? (
                    <MoodIcon mood={normalizeMood(entryForDay.mood)} size={22} />
                  ) : (
                    <span className="text-xs text-gray-300">&#x2022;</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Streak Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-sm">
        <div className="text-center mb-3">
          <h3 className="text-lg font-bold text-gray-800">
            {streak.current === 0
              ? 'Započni streak!'
              : `${streak.current} ${streak.current === 1 ? 'dan' : 'dana'} zaredom!`}
          </h3>
        </div>
        <div className="flex justify-around text-center">
          <div>
            <p className="text-2xl font-bold text-gray-800">{streak.current}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">Trenutni</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{streak.longest}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">Najduži</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{streak.total}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">Ukupno</p>
          </div>
        </div>
      </div>
    </div>
  )
}
