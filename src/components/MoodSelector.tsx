'use client'

import { MOODS, MOOD_KEYS, type MoodType } from '@/lib/moods'
import MoodIcon from '@/components/MoodIcon'

interface MoodSelectorProps {
  selected: MoodType | null
  onSelect: (mood: MoodType) => void
  intensity?: number
  onIntensityChange?: (intensity: number) => void
}

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Kako se osjećaš?</h2>
      <div className="flex items-end justify-center gap-3">
        {MOOD_KEYS.map((key) => {
          const mood = MOODS[key]
          const isSelected = selected === key
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="flex flex-col items-center gap-1.5 transition-all duration-200"
            >
              <div
                className={`rounded-2xl p-1.5 transition-all duration-200 ${
                  isSelected
                    ? 'bg-gray-100 scale-110 shadow-md ring-2 ring-gray-200'
                    : 'hover:scale-105'
                }`}
              >
                <MoodIcon mood={key} size={isSelected ? 52 : 40} />
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide ${
                  isSelected ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {mood.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
