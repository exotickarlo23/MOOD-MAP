'use client'

import { useState, useEffect } from 'react'
import { getAllEntries, type MoodEntry } from '@/lib/moodStorage'
import EntryCard from '@/components/EntryCard'
import LazyMoodChart from '@/components/LazyMoodChart'

export default function HistoryPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setEntries(getAllEntries(50))
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-5 text-center">Izvještaj</h1>

      {entries.length === 0 ? (
        <div className="text-center py-16 bg-white/30 rounded-2xl">
          <span className="text-4xl block mb-3">&#x1F4CA;</span>
          <p className="text-gray-500">Još nema unosa. Započni praćenje!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <LazyMoodChart entries={entries} />
          <div className="space-y-3">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
