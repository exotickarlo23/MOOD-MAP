'use client'

import { useState, useEffect } from 'react'
import { supabase, type MoodEntry } from '@/lib/supabase'
import { MOODS, normalizeMood } from '@/lib/moods'
import MoodIcon from '@/components/MoodIcon'

const MONTH_NAMES = [
  'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
  'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac',
]

const DAY_HEADERS = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned']

export default function CalendarPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)
      setEntries(data || [])
    }
    load()
  }, [])

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7 // Monday-based

  const days: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)

  const entryMap = new Map<string, MoodEntry>()
  entries.forEach((e) => {
    const key = new Date(e.created_at).toDateString()
    if (!entryMap.has(key)) entryMap.set(key, e)
  })

  function prevMonth() {
    setCurrentMonth(new Date(year, month - 1, 1))
  }
  function nextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const today = new Date().toDateString()

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Kalendar</h1>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 text-gray-400 hover:text-gray-700">
            &#x2039;
          </button>
          <h2 className="text-lg font-semibold text-gray-700">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 text-gray-400 hover:text-gray-700">
            &#x203A;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_HEADERS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-gray-400 uppercase">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (day === null) return <div key={i} />
            const dateStr = new Date(year, month, day).toDateString()
            const entry = entryMap.get(dateStr)
            const isToday = dateStr === today

            return (
              <div
                key={i}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs ${
                  isToday ? 'bg-gray-800 text-white' : entry ? 'bg-gray-50' : ''
                }`}
              >
                {entry ? (
                  <MoodIcon mood={normalizeMood(entry.mood)} size={20} />
                ) : (
                  <span className={isToday ? 'font-bold' : 'text-gray-400'}>{day}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
