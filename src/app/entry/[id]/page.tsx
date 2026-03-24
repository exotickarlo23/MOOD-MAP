'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, type MoodEntry } from '@/lib/supabase'
import { MOODS, type MoodType } from '@/lib/moods'
import MoodBadge from '@/components/MoodBadge'

export default function EntryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [entry, setEntry] = useState<MoodEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchEntry() {
      const { data } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('id', params.id as string)
        .single()
      setEntry(data)
      setLoading(false)
    }
    fetchEntry()
  }, [params.id])

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this entry?')) return
    setDeleting(true)
    await supabase.from('mood_entries').delete().eq('id', params.id as string)
    router.push('/history')
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="h-64 bg-white/50 rounded-2xl animate-pulse" />
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <span className="text-5xl block mb-3">🔍</span>
        <p className="text-gray-500">Entry not found</p>
        <button onClick={() => router.push('/')} className="mt-4 text-purple-500 hover:text-purple-700 font-medium">
          Go home
        </button>
      </div>
    )
  }

  const mood = MOODS[entry.mood as MoodType]
  const date = new Date(entry.created_at)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
        ← Back
      </button>

      <div className={`bg-gradient-to-br ${mood?.gradient || 'from-gray-200 to-gray-100'} rounded-3xl p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <MoodBadge mood={entry.mood} size="lg" />
          <div className="text-right">
            <p className="text-sm text-gray-600 font-medium">
              {date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-xs text-gray-500">
              {date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Intensity</p>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i < entry.intensity ? 'scale-100' : 'scale-75 opacity-20'
                  }`}
                  style={{ backgroundColor: mood?.color || '#ccc' }}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700">{entry.intensity}/10</span>
          </div>
        </div>

        {entry.story && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 mt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Story</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{entry.story}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-400 hover:text-red-600 transition-colors px-4 py-2 rounded-xl hover:bg-red-50"
          >
            {deleting ? 'Deleting...' : 'Delete entry'}
          </button>
        </div>
      </div>
    </div>
  )
}
