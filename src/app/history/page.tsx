'use client'

import { useEffect, useState } from 'react'
import { supabase, type MoodEntry } from '@/lib/supabase'
import EntryCard from '@/components/EntryCard'
import MoodChart from '@/components/MoodChart'

export default function HistoryPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEntries() {
      const { data } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      setEntries(data || [])
      setLoading(false)
    }
    fetchEntries()
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Mood History</h1>

      {loading ? (
        <div className="space-y-4">
          <div className="h-52 bg-white/50 rounded-2xl animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 bg-white/30 rounded-2xl">
          <span className="text-5xl block mb-3">📊</span>
          <p className="text-gray-500">No mood entries yet. Start tracking!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <MoodChart entries={entries} />
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
