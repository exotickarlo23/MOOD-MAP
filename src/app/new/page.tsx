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
  const [intensity, setIntensity] = useState(5)
  const [story, setStory] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!selectedMood) return
    setSaving(true)

    const { error } = await supabase.from('mood_entries').insert({
      mood: selectedMood,
      intensity,
      story: story.trim() || null,
    })

    if (error) {
      alert('Failed to save. Please try again.')
      setSaving(false)
      return
    }

    router.push('/')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">New Entry</h1>

      <div className="space-y-6">
        <MoodSelector
          selected={selectedMood}
          onSelect={setSelectedMood}
          intensity={intensity}
          onIntensityChange={setIntensity}
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
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Saving...
              </span>
            ) : (
              <span>Save {MOODS[selectedMood].emoji} Entry</span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
