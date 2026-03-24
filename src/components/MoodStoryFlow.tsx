'use client'

import { useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { MOODS, MOOD_KEYS, type MoodType } from '@/lib/moods'
import MoodIcon from '@/components/MoodIcon'
import type { MoodEntry } from '@/lib/supabase'

const MAX_CHARS = 200
const TOTAL_STEPS = 3

// 95 unique questions — no repeat for ~3 months
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
  'Koji razgovor te danas ostavio bez riječi?',
  'Da možeš ponoviti jedan sat danas, koji bi bio?',
  'Što te danas nasmijalo do suza?',
  'Koji je tvoj najdraži detalj iz danas?',
  'Kome bi poslao/la poruku zahvale večeras?',
  'Što si danas primijetio/la što inače ne bi?',
  'Kako bi opisao/la danas u tri riječi?',
  'Koji trenutak danas bi stavio/la u okvir?',
  'Što te danas podsjetilo na djetinjstvo?',
  'Da danas ima zvučni zapis, koja bi pjesma to bila?',
  'Koji okus ili jelo ti je obilježilo dan?',
  'Što si danas napravio/la prvi put?',
  'Koji problem si danas riješio/la na kreativan način?',
  'Tko te danas inspirirao?',
  'Što te danas učinilo ponosnim/om?',
  'Koji trenutak tišine si danas cijenio/la?',
  'Da možeš poslati razglednicu iz danas, što bi na njoj pisalo?',
  'Što bi savjetovao/la nekome tko prolazi isti dan kao ti?',
  'Koji neočekivani kompliment bi dao/la sebi danas?',
  'Što te danas naučilo strpljenju?',
  'Koji je bio tvoj najhrabriji potez danas?',
  'Da je danas boja, koja bi bila?',
  'Što si danas prepustio/la kontroli i bilo je ok?',
  'Koje pitanje ti se danas vrtjelo u glavi?',
  'Što te danas iznenadilo kod sebe?',
  'Koji mali čin ljubaznosti si danas primijetio/la?',
  'Da snimamo film o tvom danu, kako bi se zvao?',
  'Što je najljepše što si danas vidio/la kroz prozor?',
  'Koji trenutak danas te podsjetio zašto voliš svoj život?',
  'Što si danas otkrio/la o nekome bliskom?',
  'Kako si se danas nosio/la s nečim teškim?',
  'Koji zvuk ti je danas bio najdraži?',
  'Što te danas učinilo da se osjećaš živim/om?',
  'Da možeš zamrznuti jedan osjećaj iz danas, koji bi bio?',
  'Koji mali ritual ti je danas donio mir?',
  'Što si danas pustio/la da ode?',
  'Koja sitnica te danas razveselila?',
  'Kako si se danas izrazio/la kreativno?',
  'Koji trenutak danas bi podijelio/la s prijateljem?',
  'Što te danas naučilo o strpljenju?',
  'Da piše tvoj dnevnik, što bi rekao o danas?',
  'Koji je bio tvoj omiljeni zalogaj danas?',
  'Što si danas učinio/la sporije nego inače?',
  'Koji pogled te danas zaustavio na trenutak?',
  'Kako bi se osjećao/la da je svaki dan kao danas?',
  'Što te danas potaknulo da razmišljaš drugačije?',
  'Koji je tvoj tajni recept za dobar dan?',
  'Što si danas čitao/la, slušao/la ili gledao/la što ti se svidjelo?',
  'Koji trenutak danas bi želio/la zapamtiti zauvijek?',
  'Što te danas približilo tvojim ciljevima?',
  'Kako si danas pokazao/la ljubav prema sebi?',
  'Koji je bio najsmješniji trenutak danas?',
  'Što bi promijenio/la da možeš ponoviti danas?',
  'Koji osjećaj ti je danas bio najjači?',
  'Da možeš napisati pismo budućem sebi, što bi rekao/la o danas?',
  'Što te danas motiviralo da nastaviš dalje?',
  'Koji mali uspjeh danas zaslužuje slavlje?',
  'Kako si se danas povezao/la s nekim?',
  'Što je najljepše što ti je netko rekao danas?',
  'Koji trenutak danas te iznenadio na dobar način?',
  'Da imaš supermoć samo za danas, koju bi odabrao/la?',
  'Što si danas napravio/la što te učinilo sretnijim/om?',
  'Koji trenutak mira si danas pronašao/la?',
  'Što te danas podsjetilo da si jak/a?',
  'Koji je tvoj najdraži dio večeri?',
  'Što si danas primijetio/la u prirodi?',
  'Kako si se danas nosio/la s promjenom plana?',
  'Koji kompliment si danas zaslužio/la?',
  'Što bi rekao/la da moraš opisati danas jednom rečenicom?',
  'Koji trenutak danas ti je dao nadu?',
  'Što si danas naučio/la što nisi znao/la jutros?',
  'Kako si danas bio/la tu za nekoga?',
  'Koji miris te danas asocirao na nešto lijepo?',
  'Da danas ima naslov u novinama, koji bi bio?',
  'Što ti je danas donijelo unutarnji mir?',
  'Koji si mali izazov danas savladao/la?',
  'Što te danas podsjetilo na tvoju snagu?',
  'Kako bi ocijenio/la danas od 1 do 10 i zašto?',
  'Što te danas naučilo nešto novo o svijetu?',
  'Koji trenutak danas bi ponovio/la u slow motionu?',
  'Da moraš odabrati jednu emociju za danas, koja bi bila?',
]

function getTodayQuestion(): string {
  // Use day-of-year as seed, cycle through all 95 questions
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000)
  return DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length]
}

// Tap zones: left 30% = back, right 30% = forward
const TAP_ZONE_THRESHOLD = 0.30

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
  const contentRef = useRef<HTMLDivElement>(null)

  const question = getTodayQuestion()

  const canGoNext = useCallback(() => {
    if (step === 0) return !!selectedMood
    if (step === 1) return true // can always skip question
    return false // step 2 has a save button
  }, [step, selectedMood])

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1 && canGoNext()) {
      setStep((s) => s + 1)
    }
  }, [step, canGoNext])

  const handleBack = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1)
    } else {
      onClose()
    }
  }, [step, onClose])

  // Instagram-style tap navigation
  function handleTapNavigation(e: React.MouseEvent<HTMLDivElement>) {
    // Don't navigate if user tapped on an interactive element
    const target = e.target as HTMLElement
    if (
      target.closest('button') ||
      target.closest('textarea') ||
      target.closest('input') ||
      target.closest('a')
    ) {
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const relativeX = x / rect.width

    if (relativeX <= TAP_ZONE_THRESHOLD) {
      handleBack()
    } else if (relativeX >= 1 - TAP_ZONE_THRESHOLD) {
      if (step < TOTAL_STEPS - 1 && canGoNext()) {
        handleNext()
      }
    }
  }

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
        const { error } = await supabase
          .from('mood_entries')
          .update(moodData)
          .eq('id', todayEntry.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('mood_entries')
          .insert(moodData)
        if (error) throw error
      }

      onComplete()
    } catch (err) {
      console.error('Supabase save error:', err)
      alert('Greška pri spremanju. Pokušaj ponovo.')
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#E8F5EE] via-[#D4ECEC] to-[#F5F0E0] flex flex-col"
      onClick={handleTapNavigation}
    >
      {/* Progress bar */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-black/10">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out bg-gray-800"
                style={{ width: i <= step ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Header nav */}
      <div className="px-4 py-2 flex justify-between items-center">
        <button onClick={handleBack} className="text-gray-500 text-sm font-medium">
          {step === 0 ? 'Zatvori' : 'Natrag'}
        </button>
        <span className="text-xs text-gray-400">{step + 1}/{TOTAL_STEPS}</span>
        {step === 0 && selectedMood && (
          <button onClick={handleNext} className="text-gray-700 text-sm font-semibold">
            Dalje
          </button>
        )}
        {step === 1 && (
          <button onClick={handleNext} className="text-gray-700 text-sm font-semibold">
            {answer.trim() ? 'Dalje' : 'Preskoči'}
          </button>
        )}
        {step === 0 && !selectedMood && <div className="w-12" />}
        {step === 2 && <div className="w-12" />}
      </div>

      {/* Content area */}
      <div ref={contentRef} className="flex-1 flex items-center justify-center px-6">
        {/* Step 1: Pick mood */}
        {step === 0 && (
          <div className="w-full max-w-sm animate-fadeIn">
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
              Kako si danas?
            </h2>
            <p className="text-center text-gray-400 text-sm mb-8">
              Odaberi osjećaj koji te najbolje opisuje
            </p>
            <div className="flex items-end justify-center gap-3">
              {MOOD_KEYS.map((key) => {
                const isSelected = selectedMood === key
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedMood(key)}
                    className="flex flex-col items-center gap-1.5 flex-1 min-w-0 transition-all duration-300"
                  >
                    <div
                      className={`rounded-2xl p-1 transition-all duration-300 ${
                        isSelected
                          ? 'bg-white/90 shadow-lg ring-2 ring-white/50 scale-110'
                          : selectedMood && !isSelected
                            ? 'opacity-40'
                            : 'hover:scale-105'
                      }`}
                    >
                      <MoodIcon mood={key} size={52} />
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide transition-all duration-300 ${
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
            <div className="flex flex-col items-center text-center mb-8">
              {selectedMood && (
                <div className="mb-4">
                  <MoodIcon mood={selectedMood} size={64} />
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
            <div className="flex flex-col items-center text-center mb-8">
              {selectedMood && (
                <div className="mb-4">
                  <MoodIcon mood={selectedMood} size={64} />
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

            {!(answer.trim() || story.trim()) && (
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
