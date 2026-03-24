'use client'

import { useState, useEffect } from 'react'
import { supabase, type MoodEntry } from '@/lib/supabase'
import { MOODS, MOOD_KEYS, type MoodType, normalizeMood } from '@/lib/moods'
import MoodIcon from '@/components/MoodIcon'

const MAX_CHARS = 200

const DAY_NAMES_SHORT = ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub']

function getWeekDays() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  // Start from Monday
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

function formatCroatianDate(date: Date) {
  const days = ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota']
  const months = [
    'siječnja', 'veljače', 'ožujka', 'travnja', 'svibnja', 'lipnja',
    'srpnja', 'kolovoza', 'rujna', 'listopada', 'studenoga', 'prosinca',
  ]
  return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]}`
}

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [story, setStory] = useState('')
  const [saving, setSaving] = useState(false)
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null)
  const [weekEntries, setWeekEntries] = useState<MoodEntry[]>([])
  const [streak, setStreak] = useState({ current: 0, longest: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const { data: entries } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      const allEntries = entries || []

      // Check if there's an entry today
      const today = new Date().toDateString()
      const existing = allEntries.find(
        (e: MoodEntry) => new Date(e.created_at).toDateString() === today
      )
      if (existing) {
        setTodayEntry(existing)
        setSelectedMood(normalizeMood(existing.mood))
        setStory(existing.story || '')
      }

      // Get this week's entries
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7))
      weekStart.setHours(0, 0, 0, 0)
      const thisWeek = allEntries.filter(
        (e: MoodEntry) => new Date(e.created_at) >= weekStart
      )
      setWeekEntries(thisWeek)

      // Calculate streak
      calculateStreak(allEntries)
    } catch {
      // silently handle
    } finally {
      setLoading(false)
    }
  }

  function calculateStreak(entries: MoodEntry[]) {
    if (entries.length === 0) {
      setStreak({ current: 0, longest: 0, total: 0 })
      return
    }

    const uniqueDays = new Set(
      entries.map((e: MoodEntry) => new Date(e.created_at).toDateString())
    )
    const total = uniqueDays.size

    // Current streak
    let current = 0
    const d = new Date()
    d.setHours(0, 0, 0, 0)

    while (uniqueDays.has(d.toDateString())) {
      current++
      d.setDate(d.getDate() - 1)
    }

    // Longest streak
    const sortedDays = Array.from(uniqueDays)
      .map((s) => new Date(s))
      .sort((a, b) => a.getTime() - b.getTime())
    let longest = 0
    let run = 1
    for (let i = 1; i < sortedDays.length; i++) {
      const diff = (sortedDays[i].getTime() - sortedDays[i - 1].getTime()) / 86400000
      if (diff === 1) {
        run++
      } else {
        longest = Math.max(longest, run)
        run = 1
      }
    }
    longest = Math.max(longest, run)

    setStreak({ current, longest, total })
  }

  async function handleSave() {
    if (!selectedMood) return
    setSaving(true)

    try {
      const moodData = {
        mood: selectedMood,
        intensity: MOODS[selectedMood].intensity,
        story: story.trim() || null,
      }

      if (todayEntry) {
        await supabase
          .from('mood_entries')
          .update(moodData)
          .eq('id', todayEntry.id)
      } else {
        await supabase.from('mood_entries').insert(moodData)
      }

      await loadData()
    } catch {
      alert('Greška pri spremanju. Pokušaj ponovo.')
    } finally {
      setSaving(false)
    }
  }

  const weekDays = getWeekDays()
  const weekCount = weekEntries.length

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          <span className="text-2xl mr-1">&#x1F338;</span> Mood Map
        </h1>
        <p className="text-gray-400 text-sm italic mt-0.5">tvoj dnevni mikro-dnevnik</p>
      </div>

      {/* Mood Entry Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-sm mb-4">
        <p className="text-center text-gray-400 text-sm mb-1">
          {formatCroatianDate(new Date())}
        </p>
        <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
          Kako si danas? &#x2728;
        </h2>

        {/* Mood icons row */}
        <div className="flex items-end justify-center gap-2 mb-5">
          {MOOD_KEYS.map((key) => {
            const isSelected = selectedMood === key
            return (
              <button
                key={key}
                onClick={() => setSelectedMood(key)}
                className="flex flex-col items-center gap-1 transition-all duration-200"
              >
                <div
                  className={`rounded-2xl p-1 transition-all duration-200 ${
                    isSelected
                      ? 'bg-gray-100 scale-115 shadow-md ring-2 ring-gray-200'
                      : 'hover:scale-105'
                  }`}
                >
                  <MoodIcon mood={key} size={isSelected ? 56 : 44} />
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide ${
                    isSelected ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {MOODS[key].label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Story input */}
        <div className="relative mb-4">
          <textarea
            value={story}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setStory(e.target.value)
            }}
            placeholder="Danas je bilo dobro jer smo išli na izlet"
            rows={2}
            className="w-full p-3 rounded-xl border border-gray-200 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent text-gray-700 placeholder-gray-300 text-sm"
          />
          <span className="absolute bottom-2 right-3 text-[11px] text-gray-300">
            {story.length}/{MAX_CHARS}
          </span>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!selectedMood || saving}
          className={`w-full py-3.5 rounded-2xl font-semibold text-base transition-all duration-200 ${
            !selectedMood || saving
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              Spremam...
            </span>
          ) : (
            <span>{todayEntry ? 'Ažuriraj' : 'Spremi'}</span>
          )}
        </button>
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
            const hasEntry = weekEntries.some(
              (e) => new Date(e.created_at).toDateString() === day.date.toDateString()
            )
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
                      : hasEntry
                        ? 'bg-gray-100'
                        : 'bg-gray-50'
                  }`}
                >
                  {hasEntry && entryForDay ? (
                    <MoodIcon mood={normalizeMood(entryForDay.mood)} size={22} />
                  ) : (
                    <span className={`text-xs ${day.isToday ? 'text-gray-300' : 'text-gray-300'}`}>
                      &#x2022;
                    </span>
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
