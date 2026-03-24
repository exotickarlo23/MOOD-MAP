'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, type MoodEntry } from '@/lib/supabase'
import EntryCard from '@/components/EntryCard'

export default function Home() {
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecent() {
      const { data } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)
      setRecentEntries(data || [])
      setLoading(false)
    }
    fetchRecent()
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent mb-3">
          SMOOD STORY
        </h1>
        <p className="text-gray-500 text-lg">Your mood. Your story. Every day.</p>
      </div>

      <Link href="/new">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer mb-8">
          <span className="text-4xl block mb-2">✍️</span>
          <h2 className="text-xl font-bold">How are you feeling?</h2>
          <p className="text-purple-100 text-sm mt-1">Tap to log your mood & write your story</p>
        </div>
      </Link>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Recent Entries</h2>
          {recentEntries.length > 0 && (
            <Link href="/history" className="text-sm text-purple-500 hover:text-purple-700 font-medium">
              View all →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : recentEntries.length === 0 ? (
          <div className="text-center py-12 bg-white/30 rounded-2xl">
            <span className="text-5xl block mb-3">📝</span>
            <p className="text-gray-500">No entries yet. Start by logging your first mood!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
