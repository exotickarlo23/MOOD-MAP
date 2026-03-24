'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MOODS, type MoodType } from '@/lib/moods'
import MoodSelector from '@/components/MoodSelector'
import StoryEditor from '@/components/StoryEditor'

export default function NewEntryPage() {
  const router = useRouter()
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [story, setStory] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!selectedMood) return
    setSaving(true)

    const { error } = await supabase.from('mood_entries').insert({
      mood: selectedMood,
      intensity: MOODS[selectedMood].intensity,
      story: story.trim() || null,
    })

    if (error) {
      alert('Greška pri spremanju. Pokušaj ponovo.')
      setSaving(false)
      return
    }

    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Novi unos</h1>

      <div className="space-y-6">
        <MoodSelector
          selected={selectedMood}
          onSelect={setSelectedMood}
        />

        {selectedMood && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <StoryEditor value={story} onChange={setStory} />
          </div>
        )}

        {selectedMood && (
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-200 ${
              saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {saving ? 'Spremam...' : 'Spremi'}
          </button>
        )}
      </div>
    </div>
  )
}
