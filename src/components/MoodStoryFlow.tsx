'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { MOODS, MOOD_KEYS, type MoodType } from '@/lib/moods'
import MoodIcon from '@/components/MoodIcon'
import type { MoodEntry } from '@/lib/supabase'

const MAX_CHARS = 200
const TOTAL_STEPS = 3

// Thoughtful questions that rotate daily
const DAILY_QUESTIONS = [
  'Koji trenutak danas te natjerao da se nasmiješiš?',
  'Što te danas iznenadilo?',
  'Za što si danas zahvalan/a?',
  'Tko ti je danas uljepšao dan?',
  'Što si danas naučio/la o sebi?',
  'Koji je bio najljepši dio tvog dana?',
  'Što bi danas ponovio/la?',
  'Koji zvuk ili miris te danas vratio u lijepo sjećanje?',
  'Što te danas napunilo energijom?',
  'Kada si se danas osjećao/la najmirnijim/om?',
  'Koji mali luksuz si si danas priuštio/la?',
  'Što si danas učinio/la za sebe?',
  'Koja misao ti se danas stalno vraćala?',
  'Što bi rekao/la svom jutarnjem "ja"?',
]

function getTodayQuestion(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  return DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length]
}

interface MoodStoryFlowProps {
  todayEntry: MoodEntry | null
  onComplete: () => void
  onClose: () => void
}

export default function MoodStoryFlow({ todayEntry, onComplete, onClose }: MoodStoryFlowProps) {
  const [step, setStep] = useState(0)
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [answer, setAnswer] = useState('')
  const [story, setStory] = useState('')
  const [saving, setSaving] = useState(false)

  const question = getTodayQuestion()

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1)
    }
  }, [step])

  const handleBack = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1)
    } else {
      onClose()
    }
  }, [step, onClose])

  async function handleSave() {
    if (!selectedMood) return
    setSaving(true)

    try {
      const fullStory = [answer.trim(), story.trim()].filter(Boolean).join('\n\n')
      const moodData = {
        mood: selectedMood,
        intensity: MOODS[selectedMood].intensity,
        story: fullStory || null,
      }

      if (todayEntry) {
        await supabase
          .from('mood_entries')
          .update(moodData)
          .eq('id', todayEntry.id)
      } else {
        await supabase.from('mood_entries').insert(moodData)
      }

      onComplete()
    } catch {
      alert('Greška pri spremanju. Pokušaj ponovo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#E8F5EE] via-[#D4ECEC] to-[#F5F0E0] flex flex-col">
      {/* Progress bar */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-black/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  i <= step ? 'bg-gray-800 w-full' : 'w-0'
                }`}
                style={{ width: i <= step ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Close button */}
      <div className="px-4 py-2 flex justify-between items-center">
        <button onClick={handleBack} className="text-gray-500 text-sm font-medium">
          {step === 0 ? 'Zatvori' : 'Natrag'}
        </button>
        <span className="text-xs text-gray-400">{step + 1}/{TOTAL_STEPS}</span>
        {step < TOTAL_STEPS - 1 && selectedMood && step === 0 && (
          <button onClick={handleNext} className="text-gray-700 text-sm font-semibold">
            Dalje
          </button>
        )}
        {step === 1 && (
          <button onClick={handleNext} className="text-gray-700 text-sm font-semibold">
            {answer.trim() ? 'Dalje' : 'Preskoči'}
          </button>
        )}
        {step === 2 && <div className="w-12" />}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        {/* Step 1: Pick mood */}
        {step === 0 && (
          <div className="w-full max-w-sm animate-fadeIn">
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
              Kako si danas?
            </h2>
            <p className="text-center text-gray-400 text-sm mb-8">
              Odaberi osjećaj koji te najbolje opisuje
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {MOOD_KEYS.map((key) => {
                const isSelected = selectedMood === key
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedMood(key)}
                    className="flex flex-col items-center gap-2 transition-all duration-300"
                  >
                    <div
                      className={`rounded-2xl p-2 transition-all duration-300 ${
                        isSelected
                          ? 'bg-white/90 scale-125 shadow-lg ring-2 ring-white/50'
                          : selectedMood && !isSelected
                            ? 'opacity-40 scale-90'
                            : 'hover:scale-110'
                      }`}
                    >
                      <MoodIcon mood={key} size={isSelected ? 64 : 52} />
                    </div>
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                        isSelected ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      {MOODS[key].label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Thoughtful question */}
        {step === 1 && (
          <div className="w-full max-w-sm animate-fadeIn">
            <div className="text-center mb-8">
              {selectedMood && (
                <div className="mb-4">
                  <MoodIcon mood={selectedMood} size={48} />
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-800 leading-snug">
                {question}
              </h2>
            </div>
            <textarea
              value={answer}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) setAnswer(e.target.value)
              }}
              placeholder="Napiši ovdje..."
              rows={4}
              autoFocus
              className="w-full p-4 rounded-2xl border-0 bg-white/70 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-700 placeholder-gray-300 text-base shadow-sm"
            />
            <p className="text-right text-[11px] text-gray-300 mt-1">{answer.length}/{MAX_CHARS}</p>
          </div>
        )}

        {/* Step 3: Story / description */}
        {step === 2 && (
          <div className="w-full max-w-sm animate-fadeIn">
            <div className="text-center mb-8">
              {selectedMood && (
                <div className="mb-4">
                  <MoodIcon mood={selectedMood} size={48} />
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Opiši svoj dan
              </h2>
              <p className="text-gray-400 text-sm">
                Slobodno napiši što god želiš
              </p>
            </div>
            <textarea
              value={story}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) setStory(e.target.value)
              }}
              placeholder="Danas je bilo..."
              rows={5}
              autoFocus
              className="w-full p-4 rounded-2xl border-0 bg-white/70 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-700 placeholder-gray-300 text-base shadow-sm"
            />
            <p className="text-right text-[11px] text-gray-300 mt-1">{story.length}/{MAX_CHARS}</p>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full mt-6 py-4 rounded-2xl font-semibold text-base transition-all duration-200 ${
                saving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 text-white hover:bg-gray-700 active:scale-[0.98]'
              }`}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  Spremam...
                </span>
              ) : (
                'Spremi'
              )}
            </button>

            {(answer.trim() || story.trim()) ? null : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full mt-2 py-3 text-gray-400 text-sm font-medium"
              >
                Preskoči i spremi samo osjećaj
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
